/**
 * PUBG Tracker PRO - Core Application Logic v2.1
 * Optimized for performance and Daily Stats aggregation
 */

const API_KEY = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJmNTQyODZmMC1iM2U0LTAxMzctYjg4MC01ZmJlZDQ2ZWVjMzkiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTY3ODkxOTY2LCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6ImVyaWNrbWRzOC1nbWFpIn0.1aRSRA6OKyUVRKG-CuwuU8vPblihryupGCfAEW9w1z8";
const SHARD = "steam";
const BASE_URL = "https://api.pubg.com/shards/";

const mapMeta = {
  erangel_main: { name: "Erangel", img: "Erangel.png" },
  baltic_main: { name: "Erangel (Remastered)", img: "Erangel.png" },
  desert_main: { name: "Miramar", img: "Miramar.png" },
  savage_main: { name: "Sanhok", img: "Sanhok.png" },
  dihorotok_main: { name: "Vikendi", img: "Vikendi.png" },
  summerland_main: { name: "Karakin", img: "Karakin.jpg" },
  chimera_main: { name: "Paramo", img: "Paramo.png" },
  range_main: { name: "Camp Jackal", img: "Camp_Jackal.png" },
  kiki_main: { name: "Deston", img: "Deston.png" },
  tiger_main: { name: "Taego", img: "Taego.png" },
  neon_main: { name: "Rondo", img: "Rondo.png" },
  heaven_main: { name: "Haven", img: "Haven.png" }
};

const ID_NAMES = {
  "AIPawn_Base_Female_C": "Bot",
  "AIPawn_Base_Male_C": "Bot",
  "AirBoat_V2_C": "Hidroavião",
  "AquaRail_A_01_C": "Aquarail",
  "BP_ATV_C": "Quadriciclo",
  "BP_BearV2_C": "Urso",
  "BP_BRDM_C": "BRDM-2",
  "BP_Bicycle_C": "Bicicleta",
  "BP_CoupeRB_C": "Coupe RB",
  "BP_Dirtbike_C": "Moto de Trilha",
  "BP_IncendiaryDebuff_C": "Queimadura",
  "BP_LootTruck_C": "Caminhão de Loot",
  "BP_Motorbike_04_C": "Motocicleta",
  "BP_Motorglider_C": "Planador",
  "BP_PickupTruck_A_01_C": "Picape",
  "BP_PonyCoupe_C": "Pony Coupe",
  "BP_Scooter_01_A_C": "Scooter",
  "BP_Snowbike_01_C": "Moto de Neve",
  "BP_Snowmobile_01_C": "Snowmobile",
  "BP_Van_A_01_C": "Van",
  "BattleRoyaleModeController_Def_C": "Zona Azul",
  "Buff_DecreaseBreathInApnea_C": "Afogamento",
  "Carepackage_Container_C": "Caixa de Suprimentos",
  "Dacia_A_01_v2_C": "Dacia",
  "Jerrycan": "Galão de Combustível",
  "Lava": "Lava",
  "PlayerFemale_A_C": "Jogador",
  "PlayerMale_A_C": "Jogador",
  "ProjC4_C": "C4",
  "ProjGrenade_C": "Granada de Fragmentação",
  "ProjMolotov_C": "Coquetel Molotov",
  "ProjStickyGrenade_C": "Bomba Adesiva",
  "RedZoneBomb_C": "Zona Vermelha",
  "WeapACE32_C": "ACE32",
  "WeapAK47_C": "AKM",
  "WeapAUG_C": "AUG A3",
  "WeapAWM_C": "AWM",
  "WeapBerreta686_C": "S686",
  "WeapBerylM762_C": "Beryl",
  "WeapBizonPP19_C": "Bizon",
  "WeapCrossbow_1_C": "Besta",
  "WeapDP12_C": "DBS",
  "WeapDP28_C": "DP-28",
  "WeapDesertEagle_C": "Deagle",
  "WeapDragunov_C": "Dragunov",
  "WeapHK416_C": "M416",
  "WeapJS9_C": "JS9",
  "WeapK2_C": "K2",
  "WeapKar98k_C": "Kar98k",
  "WeapM16A4_C": "M16A4",
  "WeapM1911_C": "P1911",
  "WeapM249_C": "M249",
  "WeapM24_C": "M24",
  "WeapM9_C": "P92",
  "WeapMG3_C": "MG3",
  "WeapMP5K_C": "MP5K",
  "WeapMP9_C": "MP9",
  "WeapMini14_C": "Mini 14",
  "WeapMk12_C": "Mk12",
  "WeapMk14_C": "Mk14 EBR",
  "WeapMk47Mutant_C": "Mk47 Mutant",
  "WeapMosinNagant_C": "Mosin-Nagant",
  "WeapNagantM1895_C": "R1895",
  "WeapOriginS12_C": "O12",
  "WeapP90_C": "P90",
  "WeapPan_C": "Frigideira",
  "WeapPanzerFaust100M1_C": "Panzerfaust",
  "WeapQBU88_C": "QBU88",
  "WeapQBZ95_C": "QBZ95",
  "WeapRhino_C": "R45",
  "WeapSCAR-L_C": "SCAR-L",
  "WeapSKS_C": "SKS",
  "WeapSaiga12_C": "S12K",
  "WeapSawnoff_C": "Cano Cerrado",
  "WeapThompson_C": "Tommy Gun",
  "WeapUMP_C": "UMP45",
  "WeapUZI_C": "Micro Uzi",
  "WeapVSS_C": "VSS",
  "WeapVector_C": "Vector",
  "WeapWin94_C": "Win94",
  "WeapWinchester_C": "S1897"
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
        // Use ID_NAMES for display name, fallback to cleaned ID
        const displayName = ID_NAMES[id] || id.replace('Item_Weapon_', '').replace('Weap', '').replace('_C', '').replace('BP_', '');
        
        // Use the weapon internal name part for the image URL
        const weaponId = id.includes('Item_Weapon_') ? id : `Item_Weapon_${id.replace('Weap', '').replace('BP_', '').split('_')[0]}_C`;
        const imgId = id.replace('Weap', 'Item_Weapon_').split('_C')[0] + '_C';
        
        // Precise Path: Assets/Item/Weapon/Main/Item_Weapon_NAME_C.png
        const imgUrl = `https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Item/Weapon/Main/${imgId.startsWith('Item_Weapon_') ? imgId : 'Item_Weapon_' + imgId}.png`;
        
        return `
        <div class="weapon-card">
            <img src="${imgUrl}" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3222/3222718.png'">
            <div class="weapon-info">
                <span class="name">${displayName}</span>
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
        const info = mapMeta[id] || mapMeta[id.toLowerCase()] || { name: id, img: 'Camp_Jackal.png' }; 
        const imgUrl = `https://raw.githubusercontent.com/pubg/api-assets/master/Assets/MapSelection/${info.img}`;
        
        return `
            <div class="map-card">
                <img src="${imgUrl}">
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
