/**
 * PUBG Tracker PRO - Core Application Logic v2.1
 * Optimized for performance and Daily Stats aggregation
 */

// Firebase Integration
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA_aDw11Cx-Shs4jZ4LcWGO5Ou9iDnGdzw",
  authDomain: "pugb-egoteam.firebaseapp.com",
  projectId: "pugb-egoteam",
  storageBucket: "pugb-egoteam.firebasestorage.app",
  messagingSenderId: "191418899183",
  appId: "1:191418899183:web:833ad403d0f07bd2e5991a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const API_KEY = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJmNTQyODZmMC1iM2U0LTAxMzctYjg4MC01ZmJlZDQ2ZWVjMzkiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTY3ODkxOTY2LCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6ImVyaWNrbWRzOC1nbWFpIn0.1aRSRA6OKyUVRKG-CuwuU8vPblihryupGCfAEW9w1z8";
const SHARD = "steam";
const BASE_URL = "https://api.pubg.com/shards/";


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

const FRIENDS = ["TIAGUERArjdz", "Alis00n", "M4LW4RE-", "LillWhind", "DeLLano_", "VZN-exe", "chicoTUF"];

let chartInstance = null;
let currentAggregatedData = {}; // Global store for click-to-update dashboard

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const playerInput = document.getElementById('playerInput');
    searchBtn.addEventListener('click', () => loadPlayerData(playerInput.value));
});

async function loadPlayerData(nickname) {
    if (!nickname) return;
    
    setLoading(true);
    resetStats();

    try {
        // Fetch ALL friends + searched player in one go for efficiency and fairness
        const searchNames = Array.from(new Set([...FRIENDS, nickname])).join(',');
        const pResponse = await fetch(`${BASE_URL}${SHARD}/players?filter[playerNames]=${searchNames}`, {
            headers: { Authorization: API_KEY, Accept: "application/vnd.api+json" }
        });
        
        if (!pResponse.ok) throw new Error("Erro na API ao buscar jogadores.");
        
        const pData = await pResponse.json();
        const allPlayers = pData.data || [];
        
        // Find searched player
        const mainPlayer = allPlayers.find(p => p.attributes.name.toLowerCase() === nickname.toLowerCase());
        if (!mainPlayer) throw new Error("Jogador '" + nickname + "' não encontrado.");
        
        const playerId = mainPlayer.id;
        const officialName = mainPlayer.attributes.name;

        // --- AGGREGATE UNIQUE MATCHES FOR HALL OF FAME & DAILY ---
        const allMatchIds = new Set();
        
        // Add last 30 matches from EVERY friend to the fetch list to account for filtered event modes
        allPlayers.forEach(p => {
            const mData = p.relationships?.matches?.data || [];
            mData.slice(0, 30).forEach(m => allMatchIds.add(m.id));
        });

        // Ensure we have at least the last 40 for the searched player for their history
        const mainMatches = mainPlayer.relationships?.matches?.data || [];
        mainMatches.slice(0, 40).forEach(m => allMatchIds.add(m.id));

        const uniqueMatchIds = Array.from(allMatchIds);

        // Process everything
        await loadMatchHistoryWithFilter(uniqueMatchIds, playerId, officialName); 

    } catch (err) {
        console.error(err);
        alert("Erro ao buscar dados: " + err.message);
    } finally {
        setLoading(false);
    }
}

async function loadMatchHistoryWithFilter(matchIds, playerId, officialName) {
    const statsLabel = document.getElementById("statsTypeLabel");
    const loaderText = document.getElementById("loaderText");
    // Update labels immediately
    statsLabel.innerText = `(${officialName})`;
    if (loaderText) loaderText.innerText = `Carregando Relatório do Nub ${officialName}`;
    document.getElementById("pageLoader").classList.add("active");

    // Daily Stats Accumulators
    let totalKills = 0;
    let totalDeaths = 0;
    let totalDamage = 0;
    let totalWins = 0;
    let headshots = 0;
    let matchCount = 0;

    const weapons = {};
    const kdHistory = [];

    // FIX: Fetch match details in chunks to avoid API rate limits (429 Too Many Requests)
    const matchDetailsRaw = [];
    const chunkSize = 20;
    
    for (let i = 0; i < matchIds.length; i += chunkSize) {
        const chunk = matchIds.slice(i, i + chunkSize);
        const promises = chunk.map(async (id) => {
            try {
                const res = await fetch(`${BASE_URL}${SHARD}/matches/${id}`, {
                    headers: { Authorization: API_KEY, Accept: "application/vnd.api+json" }
                });
                if (!res.ok) return null;
                return await res.json();
            } catch (e) {
                console.warn(`Erro ao carregar partida ${id}:`, e);
                return null;
            }
        });
        const chunkResults = await Promise.all(promises);
        matchDetailsRaw.push(...chunkResults);
        
        // Minor delay between chunks if we have more to process
        if (i + chunkSize < matchIds.length) {
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    }

    const matchDetails = matchDetailsRaw.filter(m => m !== null);

    // Daily Stats Accumulators (for searched player on selected date)

    const teamHistory = [];
    const hallOfFameAggr = {}; // { player: { kills: 0, damage: 0, ... } }
    let globalMatchesProcessed = 0;

    // 2. Process each match
    for (const m of matchDetails) {
        if (!m.data) continue;
        const matchData = m.data;
        const matchType = matchData.attributes.matchType;

        // Ignore TDM, Events, and Training modes
        if (matchType === "event" || matchType === "arcade" || matchType === "training") {
            continue;
        }

        const createdAt = matchData.attributes.createdAt.split("T")[0];

        // Find friends in this match
        const friendsInMatch = (m.included || []).filter(inc => 
            inc.type === "participant" && FRIENDS.includes(inc.attributes?.stats?.name)
        );

        const rosters = (m.included || []).filter(inc => inc.type === "roster");
        const allParticipantsList = (m.included || []).filter(inc => inc.type === "participant");

        // --- HALL OF FAME LOGIC (Accumulate stats for all 5 friends) ---
        if (friendsInMatch && friendsInMatch.length > 0) {
            friendsInMatch.forEach(p => {
                const name = p.attributes.stats.name;
                if (!hallOfFameAggr[name]) {
                    hallOfFameAggr[name] = { kills: 0, damage: 0, assists: 0, neymar: 0, time: 0, matches: 0, headshots: 0, deaths: 0, wins: 0, history: [] };
                }
                // Only count the last 20 matches PER PLAYER
                if (hallOfFameAggr[name].matches < 20) {
                    
                    const myRoster = rosters.find(r => 
                        r.relationships?.participants?.data?.some(participant => participant.id === p.id)
                    );
                    
                    let friendsTeammates = [];
                    let randomTeammates = [];

                    if (myRoster) {
                        const participantIds = myRoster.relationships.participants.data.map(d => d.id);
                        const rosterParticipants = allParticipantsList.filter(inc => participantIds.includes(inc.id));
                        
                        // Collect Friend Teammates with Stats
                        friendsTeammates = rosterParticipants
                            .filter(rp => rp.attributes.stats.name !== name && FRIENDS.includes(rp.attributes.stats.name))
                            .map(rp => ({
                                name: rp.attributes.stats.name,
                                kills: rp.attributes.stats.kills,
                                damage: Math.round(rp.attributes.stats.damageDealt),
                                assists: rp.attributes.stats.assists,
                                neymar: rp.attributes.stats.DBNOs,
                                headshots: rp.attributes.stats.headshotKills || 0
                            }));

                        randomTeammates = rosterParticipants
                            .filter(rp => rp.attributes.stats.name !== name && !FRIENDS.includes(rp.attributes.stats.name))
                            .map(rp => ({
                                name: rp.attributes.stats.name,
                                kills: rp.attributes.stats.kills,
                                damage: Math.round(rp.attributes.stats.damageDealt),
                                assists: rp.attributes.stats.assists,
                                neymar: rp.attributes.stats.DBNOs,
                                headshots: rp.attributes.stats.headshotKills || 0
                            }));
                    }

                    hallOfFameAggr[name].kills += p.attributes.stats.kills;
                    hallOfFameAggr[name].damage += Math.round(p.attributes.stats.damageDealt);
                    hallOfFameAggr[name].assists += p.attributes.stats.assists;
                    hallOfFameAggr[name].neymar += p.attributes.stats.DBNOs;
                    hallOfFameAggr[name].time += Math.floor(p.attributes.stats.timeSurvived);
                    hallOfFameAggr[name].headshots += p.attributes.stats.headshotKills || 0;
                    
                    const died = (p.attributes.stats.winPlace === 1 || p.attributes.stats.winPlace === "1") ? 0 : 1;
                    hallOfFameAggr[name].deaths += died;
                    if (died === 0) hallOfFameAggr[name].wins++;
                    
                    hallOfFameAggr[name].matches++;
                    
                    hallOfFameAggr[name].history.push({
                        fullDate: matchData.attributes.createdAt,
                        mode: matchData.attributes.gameMode,
                        friendsTeammates: friendsTeammates,
                        randomTeammates: randomTeammates,
                        kills: p.attributes.stats.kills,
                        damage: Math.round(p.attributes.stats.damageDealt),
                        assists: p.attributes.stats.assists,
                        neymar: p.attributes.stats.DBNOs,
                        headshots: p.attributes.stats.headshotKills || 0,
                        died: died
                    });
                }
            });
        }

            // --- TEAM COMPETITION LOGIC (Shared matches only) ---
            if (friendsInMatch.length > 1) {
            const teamStats = friendsInMatch.map(p => ({
                name: p.attributes.stats.name,
                kills: p.attributes.stats.kills,
                damage: Math.round(p.attributes.stats.damageDealt),
                assists: p.attributes.stats.assists,
                neymar: p.attributes.stats.DBNOs,
                time: Math.floor(p.attributes.stats.timeSurvived)
            }));
            teamHistory.push({
                matchId: matchData.id,
                fullDate: matchData.attributes.createdAt,
                mode: matchData.attributes.gameMode,
                stats: teamStats
            });
        }

        // No date filter - process all found matches
        matchCount++;

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

            // --- COMPREHENSIVE TEAM COMPETITION LOGIC ---
            const friendsInMatch = m.included?.filter(inc => 
                inc.type === "participant" && 
                FRIENDS.some(f => inc.attributes?.stats?.name?.toLowerCase() === f.toLowerCase())
            );

            if (friendsInMatch && friendsInMatch.length > 1) {
                const teamStats = friendsInMatch.map(p => ({
                    name: p.attributes.stats.name,
                    kills: p.attributes.stats.kills,
                    damage: Math.round(p.attributes.stats.damageDealt),
                    assists: p.attributes.stats.assists,
                    neymar: p.attributes.stats.DBNOs,
                    time: Math.floor(p.attributes.stats.timeSurvived)
                }));
                teamHistory.push({
                    matchId: matchData.id,
                    fullDate: matchData.attributes.createdAt,
                    mode: matchData.attributes.gameMode,
                    stats: teamStats
                });
            }
        }
    }

    document.getElementById("pageLoader").classList.remove("active");
    currentAggregatedData = hallOfFameAggr; // Save for clicking
    renderHallOfFame(hallOfFameAggr);

    // Default dashboard to searched player
    if (hallOfFameAggr[officialName]) {
        updateDashboard(officialName);
    }

    // Removed redundant direct updates, now using updateDashboard
    renderWeapons(weapons);
    renderProgressionChart(kdHistory.reverse().slice(0, 10)); // Last 10 matches of that day
}

function updateDashboard(playerName) {
    const stats = currentAggregatedData[playerName];
    if (!stats) return;

    const kd = stats.deaths ? (stats.kills / stats.deaths).toFixed(2) : stats.kills;
    const hs = stats.kills ? ((stats.headshots / stats.kills) * 100).toFixed(1) : "0.0";
    const avgDmg = stats.matches ? (stats.damage / stats.matches).toFixed(0) : 0;

    updateText('killsVal', stats.kills);
    updateText('kdVal', kd);
    updateText('winsVal', stats.wins); 
    updateText('matchesVal', stats.matches);
    updateText('damageVal', avgDmg);
    updateText('hsVal', hs + "%");
    
    document.getElementById("statsTypeLabel").innerText = `(${playerName})`;
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
    document.getElementById("hallOfFameSection").style.display = "none";
}

function renderHallOfFame(data) {
    const section = document.getElementById("hallOfFameSection");
    const container = document.getElementById("hallOfFameContainer");
    
    const players = Object.entries(data);
    if (players.length === 0) {
        section.style.display = "none";
        return;
    }

    section.style.display = "block";
    
    // Sort by Kills (primary) and Damage (secondary)
    const sorted = players.sort((a,b) => b[1].kills - a[1].kills || b[1].damage - a[1].damage);

    const rows = sorted.map(([name, stats], index) => {
        const timeH = Math.floor(stats.time / 3600);
        const timeM = Math.floor((stats.time % 3600) / 60);
        const isMior = index === 0;
        const isLast = index === sorted.length - 1 && sorted.length > 1;

        let badgeText = '';
        let badgeStyle = '';

        if (isMior) {
            badgeText = 'Mior Siuuuu!!!';
            badgeStyle = 'background: #ffd700; color: #000;';
        } else if (isLast) {
            badgeText = 'Xupingole o lixo supremo';
            badgeStyle = 'background: #4a3728; color: #fff;';
        } else if (index === 1) {
            badgeText = 'Lixinho';
            badgeStyle = 'background: #8e8e8e; color: #fff;';
        } else if (index === 2) {
            badgeText = 'Verme';
            badgeStyle = 'background: #6d6d6d; color: #fff;';
        } else if (index === 3) {
            badgeText = 'Inseto';
            badgeStyle = 'background: #555; color: #fff;';
        }

        const kd = (stats.kills / Math.max(1, stats.deaths)).toFixed(2);
        const hsRate = stats.kills > 0 ? Math.round((stats.headshots / stats.kills) * 100) : 0;
        const safeId = name.replace(/[^a-zA-Z0-9]/g, '');

        const historyRows = (stats.history || []).map(h => {
            let timeStr = "";
            if (h.fullDate) {
                const d = new Date(h.fullDate);
                const diffMs = new Date() - d;
                const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                const diffMins = Math.floor(diffMs / (1000 * 60));
                
                let agoStr = "";
                if (diffHrs < 1) agoStr = `${diffMins}m atrás`;
                else if (diffHrs < 24) agoStr = `${diffHrs}h atrás`;
                else agoStr = `${Math.floor(diffHrs/24)}d atrás`;

                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const hrs = String(d.getHours()).padStart(2, '0');
                const mins = String(d.getMinutes()).padStart(2, '0');
                timeStr = `${day}/${month} ${hrs}:${mins} <span style="color:#555; display:block; font-size:10px;">${agoStr}</span>`;
            }

            let modeIcon = '';
            if (h.mode && h.mode.includes('squad')) {
                modeIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`;
            } else if (h.mode && h.mode.includes('duo')) {
                modeIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>`;
            } else {
                modeIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
            }
            
            let teammatesHtml = '';
            const matchRowId = `match-${safeId}-${(Math.random()*10000).toFixed(0)}`;
            
            // Ego Team Section
            let egoHtml = '';
            if (h.friendsTeammates && h.friendsTeammates.length > 0) {
                egoHtml = `<div style="display: flex; align-items: center; flex-wrap: wrap; gap: 6px; margin-bottom: 8px;">
                    <span style="color: #ffd700; font-weight: 800; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; min-width: 65px;">Ego Team:</span>` +
                    h.friendsTeammates.map(t => {
                        const myStats = JSON.stringify({ name: name, kills: h.kills, damage: h.damage, assists: h.assists, headshots: h.headshots, neymar: h.neymar }).replace(/"/g, '&quot;');
                        const friendStats = JSON.stringify(t).replace(/"/g, '&quot;');
                        return `<span onclick="toggleVersus('${matchRowId}', ${myStats}, ${friendStats}); event.stopPropagation();" 
                             style="background: rgba(255,215,0,0.1); border: 1px solid rgba(255,215,0,0.4); padding: 3px 8px; border-radius: 4px; font-size: 10px; color: #ffd700; font-weight: 700; cursor: pointer; transition: all 0.2s;"
                             class="teammate-badge" title="Clique para Versus">
                            ${t.name}
                        </span>`;
                    }).join('') +
                    // TODOS Button
                    `<span onclick="toggleVersusAll('${matchRowId}', ${JSON.stringify({ name: name, kills: h.kills, damage: h.damage, assists: h.assists, headshots: h.headshots, neymar: h.neymar }).replace(/"/g, '&quot;')}, ${JSON.stringify([...h.friendsTeammates, ...h.randomTeammates]).replace(/"/g, '&quot;')}); event.stopPropagation();" 
                        style="background: #ffd700; color: #111; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: 900; cursor: pointer; margin-left: auto; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                        TODOS
                    </span>
                </div>`;
            }

            // Aleatórios Section
            let randomHtml = '';
            if (h.randomTeammates && h.randomTeammates.length > 0) {
                randomHtml = `<div style="display: flex; align-items: center; flex-wrap: wrap; gap: 6px;">
                    <span style="color: #64748b; font-weight: 800; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; min-width: 65px;">Aleatórios:</span>` +
                    h.randomTeammates.map(t => {
                        const myStats = JSON.stringify({ name: name, kills: h.kills, damage: h.damage, assists: h.assists, headshots: h.headshots, neymar: h.neymar }).replace(/"/g, '&quot;');
                        const friendStats = JSON.stringify(t).replace(/"/g, '&quot;');
                        return `<span onclick="toggleVersus('${matchRowId}', ${myStats}, ${friendStats}); event.stopPropagation();" 
                             style="background: rgba(100,116,139,0.1); border: 1px solid rgba(100,116,139,0.3); padding: 3px 8px; border-radius: 4px; font-size: 10px; color: #94a3b8; cursor: pointer; transition: all 0.2s;"
                             class="teammate-badge" title="Clique para Versus">
                            ${t.name}
                        </span>`;
                    }).join('') + `</div>`;
            }

            teammatesHtml = `<div style="padding: 5px 0; min-width: 300px;">${egoHtml}${randomHtml}</div>`;
            if (!teammatesHtml) {
                teammatesHtml = '<span style="color: #666; font-size: 10px;">-</span>';
            }

            return `
            <tr style="border-bottom: 1px solid #222;">
                <td style="color: #888; font-size: 11px; padding: 4px 0;">${timeStr}</td>
                <td style="color: #fff;">${h.kills}</td>
                <td style="color: #ccc;">${h.headshots}</td>
                <td style="color: #aaa;">${h.damage}</td>
                <td style="color: #aaa;">${h.assists}</td>
                <td style="color: #aaa;">${h.neymar}</td>
                <td style="text-align: center;" title="${h.mode}">${modeIcon}</td>
                <td>${teammatesHtml}</td>
            </tr>
            <tr id="${matchRowId}" class="comparison-row" style="display: none; background: #0c0c0c;">
                <td colspan="8" style="padding: 10px;">
                    <!-- Versus injection point -->
                </td>
            </tr>
        `;
        }).join('');

        const isSearched = (name.toLowerCase() === document.getElementById('playerInput').value.toLowerCase());

        return `
            <tr class="${isMior ? 'rank-top' : ''}" 
                style="cursor: pointer; ${isSearched ? 'background: rgba(247, 181, 0, 0.1); border-left: 4px solid var(--primary);' : ''}" 
                onclick="togglePlayerHistory('${safeId}', '${name.replace(/'/g, "\\'")}');">
                <td class="rank-number">#${index + 1}</td>
                <td>
                    <span class="player-name">${name}</span>
                    ${badgeText ? `<span class="mior-badge" style="${badgeStyle}">${badgeText}</span>` : ''}
                </td>
                <td class="highlight-stat">${stats.kills} Kills</td>
                <td><span style="color: #999;">Dano:</span> ${stats.damage.toLocaleString()}</td>
                <td><span style="color: #999;">Asst:</span> ${stats.assists}</td>
                <td><span style="color: #999;">Neymar:</span> ${stats.neymar}</td>
                <td><span style="color: #999;">Partidas:</span> ${stats.matches}</td>
                <td style="font-size: 11px; text-align: right;">${timeH}h ${timeM}m vivo</td>
            </tr>
            <tr id="history-${safeId}" class="player-history-row" style="display: none; background: #1a1a1a;">
                <td colspan="8" style="padding: 15px; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 5px;">
                        <span style="color: #ffd700; font-weight: bold; font-size: 13px;">DETALHES DAS ${stats.matches} PARTIDAS:</span>
                        <div style="font-size: 13px;">
                            <span style="margin-right: 15px; color: #fff;">K/D Global: <strong style="color: #ffd700;">${kd}</strong></span>
                            <span style="color: #fff;">Taxa de HS: <strong style="color: #ffd700;">${hsRate}%</strong></span>
                        </div>
                    </div>
                    <table style="width: 100%; text-align: left; font-size: 12px; border-collapse: collapse;">
                        <thead>
                            <tr style="color: #ffd700; border-bottom: 1px solid #333;">
                                <th style="padding: 5px 0;">Data</th>
                                <th>Kills</th>
                                <th>Headshots</th>
                                <th>Dano</th>
                                <th>Assists</th>
                                <th>Neymar</th>
                                <th style="text-align: center;">Modo</th>
                                <th>Companheiros</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${historyRows}
                        </tbody>
                    </table>
                </td>
            </tr>
        `;
    }).join('');

    container.innerHTML = `
        <table class="rank-table">
            <tbody>
                ${rows}
            </tbody>
        </table>
    `;
}

function togglePlayerHistory(safeId, playerName) {
    const historyRow = document.getElementById(`history-${safeId}`);
    if (!historyRow) return;

    const isAlreadyOpen = historyRow.style.display === 'table-row';

    // Close all other player histories
    document.querySelectorAll('.player-history-row').forEach(row => {
        row.style.display = 'none';
    });

    if (!isAlreadyOpen) {
        historyRow.style.display = 'table-row';
    }
    
    // Always update dashboard stats at the top
    updateDashboard(playerName);
}

function toggleVersus(containerId, me, friend) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const isAlreadyOpen = container.style.display === 'table-row' && container.dataset.player === friend.name;

    // First, close ALL comparison rows to keep it "unpolluted"
    document.querySelectorAll('.comparison-row').forEach(row => {
        row.style.display = 'none';
        row.dataset.player = '';
    });

    if (isAlreadyOpen) {
        return; // It's now hidden because of the loop above
    }

    container.dataset.player = friend.name;
    container.style.display = 'table-row';

    const getWinnerClass = (v1, v2) => {
        if (v1 > v2) return 'color: var(--primary); font-weight: 800; text-shadow: 0 0 10px var(--primary-glow);';
        if (v1 < v2) return 'color: #555;';
        return 'color: #fff;';
    };

    const row = (label, v1, v2) => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.03);">
            <div style="flex: 1; text-align: right; ${getWinnerClass(v1, v2)}">${v1}</div>
            <div style="width: 120px; text-align: center; color: #666; font-size: 10px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">${label}</div>
            <div style="flex: 1; text-align: left; ${getWinnerClass(v2, v1)}">${v2}</div>
        </div>
    `;

    container.innerHTML = `
        <td colspan="8" style="padding: 15px 30px;">
            <div style="background: linear-gradient(180deg, rgba(20,20,20,0.8), rgba(10,10,10,0.8)); border: 1px solid var(--glass-border); border-radius: 12px; padding: 20px; box-shadow: inset 0 0 20px rgba(0,0,0,0.5);">
                <!-- Header Names -->
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid var(--glass-border); padding-bottom: 10px;">
                    <div style="flex: 1; text-align: right; font-weight: 700; color: #fff; font-size: 14px;">${me.name}</div>
                    <div style="width: 120px; text-align: center; color: var(--primary); font-weight: 900; font-style: italic;">VERSUS</div>
                    <div style="flex: 1; text-align: left; font-weight: 700; color: #fff; font-size: 14px;">${friend.name}</div>
                </div>
                
                <!-- Main Stats -->
                ${row('Kills', me.kills, friend.kills)}
                ${row('Dano Causado', me.damage, friend.damage)}
                ${row('Assistências', me.assists, friend.assists)}
                ${row('Headshots', me.headshots, friend.headshots)}
                ${row('Neymar (DBNO)', me.neymar, friend.neymar)}
                
                <div style="text-align: center; margin-top: 15px; font-size: 10px; color: #444;">
                    * O jogador em <span style="color: var(--primary);">dourado</span> teve a melhor performance na categoria
                </div>
            </div>
        </td>
    `;
}

function toggleVersusAll(containerId, me, teammates) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const isAlreadyOpen = container.style.display === 'table-row' && container.dataset.player === 'ALL';

    // First, close ALL comparison rows to keep it "unpolluted"
    document.querySelectorAll('.comparison-row').forEach(row => {
        row.style.display = 'none';
        row.dataset.player = '';
    });

    if (isAlreadyOpen) {
        return; // It's now hidden because of the loop above
    }

    container.dataset.player = 'ALL';
    container.style.display = 'table-row';

    const allPlayers = [me, ...teammates];
    
    // Header for the table
    let headerHtml = `<th style="text-align: left; padding: 12px 8px; color: #666; font-size: 10px; width: 150px;">JOGADOR</th>`;
    headerHtml += `<th style="text-align: center; color: var(--primary); font-size: 10px; width: 80px;">KILLS</th>`;
    headerHtml += `<th style="text-align: center; color: var(--primary); font-size: 10px; width: 80px;">DANO</th>`;
    headerHtml += `<th style="text-align: center; color: #888; font-size: 10px; width: 80px;">ASST</th>`;
    headerHtml += `<th style="text-align: center; color: #888; font-size: 10px; width: 80px;">HS</th>`;
    headerHtml += `<th style="text-align: center; color: #888; font-size: 10px; width: 80px;">NEYMAR</th>`;

    const rowsHtml = allPlayers.map(p => `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.03);">
            <td style="padding: 12px 8px; font-weight: 700; color: ${p.name === me.name ? 'var(--primary)' : '#fff'}; font-size: 12px; text-align: left;">${p.name}</td>
            <td style="text-align: center; font-weight: 800; font-size: 14px; color: #fff;">${p.kills}</td>
            <td style="text-align: center; color: #aaa;">${p.damage}</td>
            <td style="text-align: center; color: #888;">${p.assists}</td>
            <td style="text-align: center; color: #888;">${p.headshots}</td>
            <td style="text-align: center; color: #888;">${p.neymar}</td>
        </tr>
    `).join('');

    container.innerHTML = `
        <td colspan="8" style="padding: 15px 30px;">
            <div style="background: linear-gradient(180deg, rgba(20,20,20,0.8), rgba(10,10,10,0.8)); border: 1px solid var(--glass-border); border-radius: 12px; padding: 20px; box-shadow: inset 0 0 20px rgba(0,0,0,0.5);">
                <div style="color: var(--primary); font-weight: 900; font-style: italic; margin-bottom: 15px; text-align: center; font-size: 12px; letter-spacing: 2px;">COMPARATIVO DE EQUIPE (VERSUS ALL)</div>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 1px solid #333;">${headerHtml}</tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
                <div style="text-align: center; margin-top: 15px; font-size: 10px; color: #444;">
                    * Resumo de performance de todos os membros da Ego Team na partida
                </div>
            </div>
        </td>
    `;
}

// Export functions to global scope for HTML event handlers
window.togglePlayerHistory = togglePlayerHistory;
window.toggleVersus = toggleVersus;
window.toggleVersusAll = toggleVersusAll;
window.loadPlayerData = loadPlayerData;



