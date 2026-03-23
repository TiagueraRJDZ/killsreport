/**
 * PUBG Tracker PRO - Core Application Logic
 * Optimized for performance and modern UI/UX
 */

const API_KEY = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJmNTQyODZmMC1iM2U0LTAxMzctYjg4MC01ZmJlZDQ2ZWVjMzkiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTY3ODkxOTY2LCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6ImVyaWNrbWRzOC1nbWFpIn0.1aRSRA6OKyUVRKG-CuwuU8vPblihryupGCfAEW9w1z8";
const SHARD = "steam";
const BASE_URL = "https://api.pubg.com/shards/";

const mapMeta = {
  Erangel_Main: { name: "Erangel", img: "https://static.wikia.nocookie.net/battlegrounds/images/e/e4/Erangel_Map.jpg" },
  Desert_Main: { name: "Miramar", img: "https://static.wikia.nocookie.net/battlegrounds/images/f/f5/Miramar_Map.jpg" },
  Savage_Main: { name: "Sanhok", img: "https://static.wikia.nocookie.net/battlegrounds/images/4/4f/Sanhok_Map.jpg" },
  Baltic_Main: { name: "Vikendi", img: "https://static.wikia.nocookie.net/battlegrounds/images/5/58/Vikendi_Map.jpg" },
  Tiger_Main: { name: "Taego", img: "https://static.wikia.nocookie.net/battlegrounds/images/5/5d/Taego_Map.jpg" },
  Kiki_Main: { name: "Deston", img: "https://static.wikia.nocookie.net/battlegrounds/images/b/b3/Deston_Map.jpg" },
  Chimera_Main: { name: "Paramo", img: "https://static.wikia.nocookie.net/battlegrounds/images/a/a2/Paramo_Map.jpg" }
};

let chartInstance = null;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const playerInput = document.getElementById('playerInput');

    searchBtn.addEventListener('click', () => loadPlayerData(playerInput.value));
    
    // Auto-load initial player
    loadPlayerData(playerInput.value);
});

async function loadPlayerData(nickname) {
    if (!nickname) return;
    
    setLoading(true);
    
    try {
        const pResponse = await fetch(`${BASE_URL}${SHARD}/players?filter[playerNames]=${nickname}`, {
            headers: { Authorization: API_KEY, Accept: "application/vnd.api+json" }
        });
        
        if (!pResponse.ok) throw new Error("Jogador não encontrado ou erro na API.");
        
        const pData = await pResponse.json();
        const player = pData.data[0];
        const playerId = player.id;
        const matches = player.relationships.matches.data;

        // Run Parallel Stats Loading
        await Promise.all([
            loadLifetimeStats(playerId),
            loadMatchHistory(matches.slice(0, 6)) // Analyze last 6 matches
        ]);
        
    } catch (err) {
        console.error(err);
        alert("Erro ao buscar dados: " + err.message);
    } finally {
        setLoading(false);
    }
}

async function loadLifetimeStats(id) {
    const response = await fetch(`${BASE_URL}${SHARD}/players/${id}/seasons/lifetime`, {
        headers: { Authorization: API_KEY, Accept: "application/vnd.api+json" }
    });
    
    const data = await response.json();
    const modes = data.data.attributes.gameModeStats;
    
    // Prioritize Squad, Duo, then Solo
    const m = modes.squad.roundsPlayed > 0 ? modes.squad : 
             modes.duo.roundsPlayed > 0 ? modes.duo : modes.solo;

    if (!m) return;

    const kd = (m.kills / (m.losses || 1)).toFixed(2);
    const hs = ((m.headshotKills / (m.kills || 1)) * 100).toFixed(1);

    updateText('killsVal', m.kills);
    updateText('kdVal', kd);
    updateText('winsVal', m.wins);
    updateText('matchesVal', m.roundsPlayed);
    updateText('damageVal', m.damageDealt.toFixed(0));
    updateText('hsVal', hs + "%");
}

async function loadMatchHistory(matches) {
    const weapons = {};
    const maps = {};
    const kdHistory = [];

    // Fetch match data in parallel for speed optimization
    const matchDetails = await Promise.all(
        matches.map(m => fetch(`${BASE_URL}${SHARD}/matches/${m.id}`, {
            headers: { Authorization: API_KEY, Accept: "application/vnd.api+json" }
        }).then(res => res.json()))
    );

    // Process Telemetries
    for (const m of matchDetails) {
        const mapName = m.data.attributes.mapName;
        maps[mapName] = (maps[mapName] || 0) + 1;

        const telemetryUrl = m.included.find(i => i.type === "asset")?.attributes.URL;
        if (telemetryUrl) {
            const tResponse = await fetch(telemetryUrl);
            const logs = await tResponse.json();
            
            let matchKills = 0;
            logs.forEach(e => {
                if (e._T === "LogPlayerKillV2") {
                    const weapon = e.weapon?.itemId;
                    if (weapon) {
                        weapons[weapon] = (weapons[weapon] || 0) + 1;
                    }
                    matchKills++;
                }
            });
            kdHistory.push(matchKills);
        }
    }

    renderWeapons(weapons);
    renderMaps(maps);
    renderProgressionChart(kdHistory.reverse()); // Chronological order
}

function renderWeapons(data) {
    const sorted = Object.entries(data)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);

    const container = document.getElementById("weaponsGrid");
    container.innerHTML = sorted.map(([id, count]) => `
        <div class="weapon-card">
            <img src="https://pubglist.com/images/weapons/${id}.png" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3222/3222718.png'">
            <div class="weapon-info">
                <span class="name">${id.replace('Item_Weapon_', '')}</span>
                <span class="count">${count} Abates</span>
            </div>
        </div>
    `).join('');
}

function renderMaps(data) {
    const container = document.getElementById("mapsGrid");
    container.innerHTML = Object.entries(data).map(([id, count]) => {
        const info = mapMeta[id] || { name: id, img: 'https://via.placeholder.com/300x150?text=PUBG+Map' };
        return `
            <div class="map-card">
                <img src="${info.img}">
                <div class="map-overlay">
                    <span class="map-name">${info.name}</span>
                    <span class="map-stats">${count} Partidas</span>
                </div>
            </div>
        `;
    }).join('');
}

function renderProgressionChart(data) {
    const ctx = document.getElementById("kdTrendChart").getContext("2d");
    
    // Clear existing chart
    if (chartInstance) chartInstance.destroy();

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(247, 181, 0, 0.5)');
    gradient.addColorStop(1, 'rgba(247, 181, 0, 0)');

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map((_, i) => "M" + (i + 1)),
            datasets: [{
                label: 'Kills p/ Partida',
                data: data,
                borderColor: '#f7b500',
                backgroundColor: gradient,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#f7b500',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#999' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#999' }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function updateText(id, val) {
    const el = document.getElementById(id);
    if (el) el.innerText = val;
}

function setLoading(isLoading) {
    const btn = document.getElementById('searchBtn');
    if (isLoading) {
        btn.innerText = "Buscando...";
        btn.disabled = true;
        btn.style.opacity = "0.7";
    } else {
        btn.innerText = "Buscar";
        btn.disabled = false;
        btn.style.opacity = "1";
    }
}
