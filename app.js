/**
 * PUBG Tracker PRO - Core Application Logic v2.1
 * Optimized for performance and Daily Stats aggregation
 */

const API_KEY = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJmNTQyODZmMC1iM2U0LTAxMzctYjg4MC01ZmJlZDQ2ZWVjMzkiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTY3ODkxOTY2LCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6ImVyaWNrbWRzOC1nbWFpIn0.1aRSRA6OKyUVRKG-CuwuU8vPblihryupGCfAEW9w1z8";
const SHARD = "steam";
const BASE_URL = "https://api.pubg.com/shards/";

const mapMeta = {
  erangel_main: { name: "Erangel", img: "https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Erangel_Main_High_Res.png" },
  desert_main: { name: "Miramar", img: "https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Miramar_Main_High_Res.png" },
  savage_main: { name: "Sanhok", img: "https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Sanhok_Main_High_Res.png" },
  sanhok: { name: "Sanhok", img: "https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Sanhok_Main_High_Res.png" },
  baltic_main: { name: "Vikendi", img: "https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Vikendi_Main_High_Res.png" },
  dihorotok_main: { name: "Vikendi", img: "https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Vikendi_Main_High_Res.png" },
  vikendi: { name: "Vikendi", img: "https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Vikendi_Main_High_Res.png" },
  tiger_main: { name: "Taego", img: "https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Taego_Main_High_Res.png" },
  taego: { name: "Taego", img: "https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Taego_Main_High_Res.png" },
  kiki_main: { name: "Deston", img: "https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Deston_Main_High_Res.png" },
  neon_main: { name: "Rondo", img: "https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Rondo_Main_High_Res.png" },
  main_main: { name: "Rondo", img: "https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Rondo_Main_High_Res.png" },
  chimera_main: { name: "Paramo", img: "https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Paramo_Main_High_Res.png" },
  summerland_main: { name: "Karakin", img: "https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Karakin_Main_High_Res.png" }
};

let chartInstance = null;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const playerInput = document.getElementById('playerInput');
    const dateFilter = document.getElementById('dateFilter');

    // Default to today
    const today = new Date().toISOString().split("T")[0];
    dateFilter.value = today;

    searchBtn.addEventListener('click', () => loadPlayerData(playerInput.value));
    
    // Auto-load initial player
    loadPlayerData(playerInput.value);
});

async function loadPlayerData(nickname) {
    if (!nickname) return;
    
    setLoading(true);
    resetStats();

    try {
        const pResponse = await fetch(`${BASE_URL}${SHARD}/players?filter[playerNames]=${nickname}`, {
            headers: { Authorization: API_KEY, Accept: "application/vnd.api+json" }
        });
        
        if (!pResponse.ok) throw new Error("Jogador não encontrado ou erro na API.");
        
        const pData = await pResponse.json();
        const player = pData.data[0];
        const playerId = player.id;
        const officialName = player.attributes.name;
        const matches = player.relationships.matches.data;

        // Process Match History and Manual Daily Stats
        await loadMatchHistoryWithFilter(matches.slice(0, 40), playerId, officialName); 

    } catch (err) {
        console.error(err);
        alert("Erro ao buscar dados: " + err.message);
    } finally {
        setLoading(false);
    }
}

async function loadMatchHistoryWithFilter(matches, playerId, officialName) {
    const selectedDate = document.getElementById("dateFilter").value;
    const statsLabel = document.getElementById("statsTypeLabel");
    const loadingStatus = document.getElementById("loadingStatus");
    
    statsLabel.innerText = `(${selectedDate.split('-').reverse().slice(0,2).reverse().join('/')})`;
    loadingStatus.style.display = "block";

    // Daily Stats Accumulators
    let totalKills = 0;
    let totalDeaths = 0;
    let totalDamage = 0;
    let totalWins = 0;
    let headshots = 0;
    let matchCount = 0;

    const weapons = {};
    const maps = {};
    const kdHistory = [];

    // 1. Fetch match details in parallel to filter by date
    const matchDetails = await Promise.all(
        matches.map(m => fetch(`${BASE_URL}${SHARD}/matches/${m.id}`, {
            headers: { Authorization: API_KEY, Accept: "application/vnd.api+json" }
        }).then(res => res.json()))
    );

    // 2. Process each match
    for (const m of matchDetails) {
        if (!m.data) continue;
        const matchData = m.data;
        const createdAt = matchData.attributes.createdAt.split("T")[0];

        // Filter by date
        if (createdAt !== selectedDate) continue;

        matchCount++;
        const mapName = matchData.attributes.mapName;
        maps[mapName] = (maps[mapName] || 0) + 1;

        // --- FIX: CALCULO DE VITÓRIAS ---
        const participant = m.included?.find(inc => 
            inc.type === "participant" && 
            (inc.relationships?.player?.data?.id === playerId || 
             inc.attributes?.stats?.name === officialName)
        );
        if (participant && (participant.attributes?.stats?.winPlace === 1 || participant.attributes?.stats?.winPlace === "1")) {
            totalWins++;
        }

        const telemetryUrl = m.included.find(i => i.type === "asset")?.attributes.URL;
        if (telemetryUrl) {
            const tResponse = await fetch(telemetryUrl);
            const logs = await tResponse.json();
            
            let matchKills = 0;
            logs.forEach(e => {
                // Count Kills & Headshots (Using lowercase to avoid casing issues)
                if (e._T === "LogPlayerKillV2" && e.killer?.name?.toLowerCase() === officialName.toLowerCase()) {
                    const kDI = e.killerDamageInfo;
                    // FIX: Weapon mapping for LogPlayerKillV2 (nested in killerDamageInfo)
                    const weapon = kDI?.damageCauserName || e.damageCauserName || e.weapon?.itemId;
                    if (weapon) {
                        weapons[weapon] = (weapons[weapon] || 0) + 1;
                    }
                    
                    // FIX: Robust Headshot check (nested in killerDamageInfo)
                    const isHeadshot = (kDI?.damageReason?.toLowerCase().includes("headshot")) || 
                                     (e.damageReason?.toLowerCase().includes("headshot")) ||
                                     (kDI?.additionalInfo?.some(info => info.toLowerCase().includes("headshot")));
                    
                    if (isHeadshot) {
                        headshots++;
                    }
                    matchKills++;
                    totalKills++;
                }

                // Count Damage Dealt by Player
                if (e._T === "LogPlayerTakeDamage" && e.attacker?.name?.toLowerCase() === officialName.toLowerCase()) {
                    totalDamage += e.damage;
                }

                // Check if Player died in this match
                if (e._T === "LogPlayerKillV2" && e.victim?.name?.toLowerCase() === officialName.toLowerCase()) {
                    totalDeaths++;
                }
            });
            kdHistory.push(matchKills);
        }
    }

    loadingStatus.style.display = "none";

    // 3. Final Calculation
    const kd = totalDeaths ? (totalKills / totalDeaths).toFixed(2) : totalKills;
    const hs = totalKills ? ((headshots / totalKills) * 100).toFixed(1) : "0.0";
    const avgDmg = matchCount ? (totalDamage / matchCount).toFixed(0) : 0;

    // Update UI
    updateText('killsVal', totalKills);
    updateText('kdVal', kd);
    updateText('winsVal', totalWins); 
    updateText('matchesVal', matchCount);
    updateText('damageVal', avgDmg);
    updateText('hsVal', hs + "%");

    renderWeapons(weapons);
    renderMaps(maps);
    renderProgressionChart(kdHistory.reverse().slice(0, 10)); // Last 10 matches of that day
}

function renderWeapons(data) {
    const sorted = Object.entries(data)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);

    const container = document.getElementById("weaponsGrid");
    if (sorted.length === 0) {
        container.innerHTML = `<p style="color: grey; font-size: 14px; grid-column: 1/-1; text-align: center;">Nenhuma partida encontrada.</p>`;
        return;
    }

    container.innerHTML = sorted.map(([id, count]) => {
        const cleanName = id.replace('Item_Weapon_', '').replace('Weap', '').replace('_C', '').replace('BP_', '');
        // FIX: Precise URL mapping for weapon icons
        const mapping = {
            'AUG': 'AUG', 'MP5K': 'MP5K', 'HK416': 'HK416', 'Thompson': 'Thompson',
            'Berreta686': 'Berreta686', 'QBZ95': 'QBZ95', 'M16A4': 'M16A4', 'SCAR-L': 'SCAR-L',
            'AKM': 'AKM', 'M24': 'M24', 'Kar98k': 'Kar98k', 'Mini14': 'Mini14', 'SKS': 'SKS'
        };
        const weaponId = mapping[cleanName] || cleanName;
        const imgUrl = `https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Item/Weapon/Main/Item_Weapon_${weaponId}_C.png`;
        
        return `
        <div class="weapon-card">
            <img src="${imgUrl}" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3222/3222718.png'">
            <div class="weapon-info">
                <span class="name">${cleanName}</span>
                <span class="count">${count} Abates</span>
            </div>
        </div>
    `}).join('');
}

function renderMaps(data) {
    const container = document.getElementById("mapsGrid");
    const entries = Object.entries(data);
    
    if (entries.length === 0) {
        container.innerHTML = `<p style="color: grey; font-size: 14px; grid-column: 1/-1; text-align: center;">Sem atividade no mapa para esta data.</p>`;
        return;
    }

    container.innerHTML = entries.map(([id, count]) => {
        // FIX: Case-insensitive map lookup
        const info = mapMeta[id] || mapMeta[id.toLowerCase()] || { name: id, img: 'https://via.placeholder.com/300x150?text=PUBG+Map' };
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
    if (chartInstance) chartInstance.destroy();

    if (data.length === 0) return;

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
                pointBorderWidth: 2,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#999' } },
                x: { grid: { display: false }, ticks: { color: '#999' } }
            },
            plugins: { legend: { display: false } }
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
    } else {
        btn.innerText = "Buscar";
        btn.disabled = false;
    }
}

function resetStats() {
    ['killsVal', 'kdVal', 'winsVal', 'matchesVal', 'damageVal', 'hsVal'].forEach(id => updateText(id, "-"));
    document.getElementById("weaponsGrid").innerHTML = "";
    document.getElementById("mapsGrid").innerHTML = "";
}
