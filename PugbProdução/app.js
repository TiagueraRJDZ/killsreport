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
  "ProjFlashBang_C": "Flashbang",
  "ProjSmokeBomb_C": "Granada de Fumaça",
  "ProjDecoyGrenade_C": "Granada de Distração",
  "ProjBluezoneGrenade_C": "Granada Bluezone",
  "ProjSpikeTrap_C": "Armadilha de Espinhos",
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
    
    // Press enter to search
    playerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loadPlayerData(playerInput.value);
    });

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

        // --- AGGREGATE UNIQUE MATCHES FOR HALL OF FAME ---
        const allMatchIds = new Set();
        
        allPlayers.forEach(p => {
            const mData = p.relationships?.matches?.data || [];
            // Get up to 50 matches for each to ensure we find at least 20 official ones (ignoring arcade/TDM)
            mData.slice(0, 50).forEach(m => allMatchIds.add(m.id));
        });

        const uniqueMatchIds = Array.from(allMatchIds);

        // Process everything (showing last 20 games of each player)
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

    // Fix: Sort matches by creation date descending BEFORE processing.
    // This mathematically guarantees that the first 20 matches we process 
    // for ANY player are truly their most recent 20 matches.
    const matchDetails = matchDetailsRaw.filter(m => m !== null);
    matchDetails.sort((a, b) => new Date(b.data.attributes.createdAt) - new Date(a.data.attributes.createdAt));

    // Daily Stats Accumulators (for searched player on selected date)

    const teamHistory = [];
    const hallOfFameAggr = {}; // { player: { kills: 0, damage: 0, ... } }
    let globalMatchesProcessed = 0;
    const telemetryTasks = [];

    // 2. Process each match
    for (const m of matchDetails) {
        if (!m.data) continue;
        const matchData = m.data;
        const createdAt = matchData.attributes.createdAt.split("T")[0];

        const matchType = matchData.attributes.matchType;

        // Ignore TDM, Events, and Training modes
        if (matchType === "event" || matchType === "arcade" || matchType === "training") {
            continue;
        }

        // Find players we care about for the Hall of Fame (EgoTeam + Searched Player)
        const myPlayersInMatch = (m.included || []).filter(inc => 
            inc.type === "participant" && 
            (FRIENDS.includes(inc.attributes?.stats?.name) || inc.attributes?.stats?.name === officialName)
        );

        // Find friends STRICTLY in EgoTeam (for purely EgoTeam comparisons like Versus)
        const friendsInMatch = (m.included || []).filter(inc => 
            inc.type === "participant" && FRIENDS.includes(inc.attributes?.stats?.name)
        );

        const rosters = (m.included || []).filter(inc => inc.type === "roster");
        const allParticipantsList = (m.included || []).filter(inc => inc.type === "participant");

        // --- HALL OF FAME LOGIC (Accumulate stats for all relevant players) ---
        if (myPlayersInMatch && myPlayersInMatch.length > 0) {
            myPlayersInMatch.forEach(p => {
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
                        matchId: matchData.id,
                        fullDate: matchData.attributes.createdAt,
                        mode: matchData.attributes.gameMode,
                        friendsTeammates: friendsTeammates,
                        randomTeammates: randomTeammates,
                        kills: p.attributes.stats.kills,
                        damage: Math.round(p.attributes.stats.damageDealt),
                        assists: p.attributes.stats.assists,
                        neymar: p.attributes.stats.DBNOs,
                        headshots: p.attributes.stats.headshotKills || 0,
                        died: died,
                        botKills: null,
                        playerKills: null,
                        botVictims: [],
                        playerVictims: [],
                        killerOfUser: null
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

        // --- BASE STATS AGGREGATION ---
        const participant = m.included?.find(inc => 
            inc.type === "participant" && 
            (inc.relationships?.player?.data?.id === playerId || 
             inc.attributes?.stats?.name === officialName)
        );

        if (participant) {
            const pStats = participant.attributes.stats;
            if (pStats.winPlace === 1 || pStats.winPlace === "1") totalWins++;
            totalKills += pStats.kills;
            totalDamage += Math.round(pStats.damageDealt);
            totalDeaths += (pStats.winPlace === 1 || pStats.winPlace === "1") ? 0 : 1;
            headshots += pStats.headshotKills || 0;
            kdHistory.push({ fullDate: matchData.attributes.createdAt, kills: pStats.kills });
        }

    }

    // --- BUILD TELEMETRY TASKS from actual HoF history entries ---
    // Strategy: after hallOfFameAggr is fully built, collect telemetry for EXACTLY
    // the matches that appear in any player's history. This guarantees 100% coverage
    // for all players (DeLLano_, TIAGUERArjdz, etc.) regardless of match sort order.
    const matchDetailMap = new Map(matchDetails.filter(m => m.data).map(m => [m.data.id, m]));
    const coveredTelemetryIds = new Set();
    Object.values(hallOfFameAggr).forEach(pData => {
        pData.history.forEach(h => {
            if (coveredTelemetryIds.has(h.matchId)) return;
            const matchDetail = matchDetailMap.get(h.matchId);
            if (!matchDetail) return;
            const telemetryUrl = matchDetail.included?.find(i => i.type === "asset")?.attributes.URL;
            if (telemetryUrl) {
                coveredTelemetryIds.add(h.matchId);
                telemetryTasks.push({ url: telemetryUrl, matchId: h.matchId });
            }
        });
    });

    // --- BATCH PARALLEL TELEMETRY FETCH ---
    const chunkSizeTelemetry = 5;
    for (let i = 0; i < telemetryTasks.length; i += chunkSizeTelemetry) {
        const chunk = telemetryTasks.slice(i, i + chunkSizeTelemetry);
        await Promise.all(chunk.map(async (task) => {
            try {
                const tResponse = await fetch(task.url);
                if (!tResponse.ok) return;
                const logs = await tResponse.json();
                
                // Build a case-insensitive lookup map for HoF players (computed once per task)
                const hofNameMap = {};
                Object.keys(hallOfFameAggr).forEach(n => { hofNameMap[n.toLowerCase()] = n; });

                // Identify ALL bots in this match using the match data participants list
                // Official PUBG API: Bots have account IDs starting with 'ai.', humans with 'account.'
                const matchDetail = matchDetailMap.get(task.matchId);
                const botNamesInMatch = new Set();
                if (matchDetail && matchDetail.included) {
                    matchDetail.included.forEach(inc => {
                        if (inc.type === "participant") {
                            const pId = inc.attributes?.stats?.playerId;
                            const pName = inc.attributes?.stats?.name;
                            // Check if it's a known bot ID or doesn't have a legitimate player ID format
                            if (pId && (pId.startsWith("ai.") || !pId.startsWith("account.")) && pName) {
                                botNamesInMatch.add(pName.toLowerCase());
                            }
                        }
                    });
                }

                let matchStartTime = null;
                logs.forEach(e => { if (e._T === "LogMatchStart") matchStartTime = e._D; });
                if (!matchStartTime && logs.length > 0) matchStartTime = logs[0]._D;

                logs.forEach(e => {
                    const eventTime = e._D;
                    const elapsedMs = matchStartTime ? (new Date(eventTime) - new Date(matchStartTime)) : 0;
                    const m = Math.floor(Math.max(0, elapsedMs) / 60000);
                    const s = Math.floor((Math.max(0, elapsedMs) % 60000) / 1000);
                    const timeStamp = `${m}:${s.toString().padStart(2, '0')}`;
                    
                    // --- TEAM/SQUAD EVENT TRACKING ---
                    const attackerName = e.attacker?.name;
                    const killerName = e.killer?.name || e.damageCauserName || e.damageReason || attackerName;
                    const victimName = e.victim?.name;
                    const kDI = e.killerDamageInfo;
                    const weapon = kDI?.damageCauserName || e.damageCauserName || e.weapon?.itemId;
                    const hfMapK = killerName ? hofNameMap[killerName.toLowerCase()] : null;
                    const hfMapV = victimName ? hofNameMap[victimName.toLowerCase()] : null;

                    // KILLS / DEATHS
                    if (e._T === "LogPlayerKillV2" && victimName) {
                        const isHS = kDI?.damageReason === "HeadShot" || e.damageReason === "HeadShot";
                        if (hfMapK) {
                             const entry = (hallOfFameAggr[hfMapK].history || []).find(h => h.matchId === task.matchId);
                             if (entry) {
                                 if (!entry.timeline) entry.timeline = [];
                                 entry.timeline.push({ type: 'kill', time: timeStamp, killer: killerName, victim: victimName, weapon: ID_NAMES[weapon] || weapon || 'Desconhecido', headshot: isHS });
                             }
                        }
                        if (hfMapV) {
                             const entry = (hallOfFameAggr[hfMapV].history || []).find(h => h.matchId === task.matchId);
                             if (entry) {
                                 if (!entry.timeline) entry.timeline = [];
                                 entry.timeline.push({ type: 'death', time: timeStamp, killer: killerName, victim: victimName, weapon: ID_NAMES[weapon] || weapon || 'Desconhecido', headshot: isHS });
                             }
                        }
                    }

                    // KNOCKOUTS (Team or User)
                    if (e._T === "LogPlayerMakeDamageV2" && e.isFatal && victimName) {
                        if (hfMapK) {
                             const entry = (hallOfFameAggr[hfMapK].history || []).find(h => h.matchId === task.matchId);
                             if (entry) {
                                 if (!entry.timeline) entry.timeline = [];
                                 entry.timeline.push({ type: 'knock', time: timeStamp, killer: killerName, victim: victimName });
                             }
                        }
                        if (hfMapV) {
                             const entry = (hallOfFameAggr[hfMapV].history || []).find(h => h.matchId === task.matchId);
                             if (entry) {
                                 if (!entry.timeline) entry.timeline = [];
                                 entry.timeline.push({ type: 'get_knocked', time: timeStamp, killer: killerName, victim: victimName });
                             }
                        }
                    }

                    // REVIVES
                    if (e._T === "LogPlayerRevive" && victimName) {
                        const reviverName = e.reviver?.name;
                        const hfMapR = reviverName ? hofNameMap[reviverName.toLowerCase()] : null;

                        if (hfMapV) {
                             const entry = (hallOfFameAggr[hfMapV].history || []).find(h => h.matchId === task.matchId);
                             if (entry) {
                                 if (!entry.timeline) entry.timeline = [];
                                 entry.timeline.push({ type: 'revive', time: timeStamp, reviver: reviverName || 'Companheiro', victim: victimName });
                             }
                        }
                        if (hfMapR) {
                             const entry = (hallOfFameAggr[hfMapR].history || []).find(h => h.matchId === task.matchId);
                             if (entry) {
                                 if (!entry.timeline) entry.timeline = [];
                                 entry.timeline.push({ type: 'revive_other', time: timeStamp, reviver: reviverName, victim: victimName });
                             }
                        }
                    }

                    // --- ORIGINAL COUNT LOGIC (Remains same) ---
                    if (e._T === "LogPlayerKillV2") {
                        const killerLower = killerName ? killerName.toLowerCase() : "";
                        const victimLower = victimName.toLowerCase();
                        if (killerLower === officialName.toLowerCase() && weapon) {
                            weapons[weapon] = (weapons[weapon] || 0) + 1;
                        }
                        if (hfMapK) {
                            const isBot = (e.victim?.character?.name || '').toLowerCase().includes('aipawn') || 
                                        (e.victim?.accountId || '').startsWith('ai.') || 
                                        botNamesInMatch.has(victimLower);
                            const hEntry = (hallOfFameAggr[hfMapK].history || []).find(h => h.matchId === task.matchId);
                            if (hEntry) {
                                if (hEntry.botKills === null) hEntry.botKills = 0; if (hEntry.playerKills === null) hEntry.playerKills = 0;
                                if (isBot) { hEntry.botKills++; hEntry.botVictims.push(victimName); } else { hEntry.playerKills++; hEntry.playerVictims.push(victimName); }
                            }
                        }
                        if (hfMapV) {
                            const hEntry = (hallOfFameAggr[hfMapV].history || []).find(h => h.matchId === task.matchId);
                            if (hEntry && killerName) hEntry.killerOfUser = killerName;
                        }
                    }
                });
            } catch (err) {
                console.warn(`Erro na telemetria da partida ${task.matchId}:${err.message}`);
            }
        }));
    }

    // --- ACCUMULATE TRUE KILLS TOTALS ---
    Object.values(hallOfFameAggr).forEach(pData => {
        pData.realKillsTotal = 0;
        pData.history.forEach(h => {
             // Use 0 if telemetry failed or no kills
             pData.realKillsTotal += (h.playerKills || 0);
        });
    });

    document.getElementById("pageLoader").classList.remove("active");
    currentAggregatedData = hallOfFameAggr; // Save for clicking
    renderHallOfFame(hallOfFameAggr);

    // Default dashboard to searched player
    if (hallOfFameAggr[officialName]) {
        updateDashboard(officialName);
    }

    // Removed redundant direct updates, now using updateDashboard
    renderWeapons(weapons);

    // Sort KD history chronologically for the chart (oldest to newest)
    kdHistory.sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate)); 
    const sortedKdHistory = kdHistory.slice(-10).map(k => k.kills);
    renderProgressionChart(sortedKdHistory);
}

function updateDashboard(playerName) {
    const stats = currentAggregatedData[playerName];
    if (!stats) return;

    const realKills = stats.realKillsTotal || 0;
    const kd = stats.deaths ? (realKills / stats.deaths).toFixed(2) : realKills;
    const hs = realKills ? ((stats.headshots / realKills) * 100).toFixed(1) : "0.0";
    const avgDmg = stats.matches ? (stats.damage / stats.matches).toFixed(0) : 0;

    updateText('killsVal', realKills);
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
        
        let imgUrl = "";
        if (id.startsWith('Proj')) {
            // Throwable logic: Assets/Item/Equipment/Throwable/Item_Weapon_NAME_C.png
            const imgId = id.replace('Proj', 'Item_Weapon_');
            imgUrl = `https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Item/Equipment/Throwable/${imgId}.png`;
        } else {
            // Standard Weapon logic: Assets/Item/Weapon/Main/Item_Weapon_NAME_C.png
            const imgId = id.replace('Weap', 'Item_Weapon_').split('_C')[0] + '_C';
            const finalImgId = imgId.startsWith('Item_Weapon_') ? imgId : 'Item_Weapon_' + imgId;
            imgUrl = `https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Item/Weapon/Main/${finalImgId}.png`;
        }
        
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
    
    // Sort historical matches by date (Newest first)
    players.forEach(([_, stats]) => {
        if (stats.history) {
            stats.history.sort((a, b) => new Date(b.fullDate) - new Date(a.fullDate));
        }
    });

    // Sort by Real Kills (primary) and Damage (secondary)
    const sorted = players.sort((a,b) => (b[1].realKillsTotal || 0) - (a[1].realKillsTotal || 0) || b[1].damage - a[1].damage);

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

        const realKills = stats.realKillsTotal || 0;
        const kd = (realKills / Math.max(1, stats.deaths)).toFixed(2);
        const hsRate = realKills > 0 ? Math.round((stats.headshots / realKills) * 100) : 0;
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
                
                timeStr = `<div style="line-height: 1.2;">${day}/${month} ${hrs}:${mins} <span style="color:#555; display:block; font-size:10px;">${agoStr}</span></div>`;
            }

            const userSvg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" style="margin: 0 -3px; flex-shrink: 0;"><path d="M20 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>`;
            let modeIcon = '';
            if (h.mode && h.mode.includes('squad')) {
                modeIcon = `<div style="display: flex; justify-content: center; align-items: center; min-width: 45px;">${userSvg}${userSvg}${userSvg}${userSvg}</div>`;
            } else if (h.mode && h.mode.includes('duo')) {
                modeIcon = `<div style="display: flex; justify-content: center; align-items: center; min-width: 45px;">${userSvg}${userSvg}</div>`;
            } else {
                modeIcon = `<div style="display: flex; justify-content: center; align-items: center; min-width: 45px;">${userSvg}</div>`;
            }
            
            let teammatesHtml = '';
            const matchRowId = `match-${safeId}-${(Math.random()*10000).toFixed(0)}`;
            
            // Ego Team Section
            let egoHtml = '';
            if (h.friendsTeammates && h.friendsTeammates.length > 0) {
                egoHtml = `<div style="display: flex; align-items: center; flex-wrap: wrap; gap: 6px; margin-bottom: ${h.randomTeammates && h.randomTeammates.length > 0 ? '8px' : '0'};">
                    <span style="color: #ffd700; font-weight: 800; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; min-width: 65px;">Ego Team:</span>` +
                    h.friendsTeammates.map(t => {
                        const myStats = JSON.stringify({ name: name, kills: h.kills, damage: h.damage, assists: h.assists, headshots: h.headshots, neymar: h.neymar }).replace(/"/g, '&quot;');
                        const friendStats = JSON.stringify(t).replace(/"/g, '&quot;');
                        return `<span onclick="toggleVersus('${matchRowId}', ${myStats}, ${friendStats}); event.stopPropagation();" 
                             style="background: rgba(255,215,0,0.1); border: 1px solid rgba(255,215,0,0.4); padding: 3px 8px; border-radius: 4px; font-size: 10px; color: #ffd700; font-weight: 700; cursor: pointer; transition: all 0.2s;"
                             class="teammate-badge" title="Clique para Versus">
                            ${t.name || 'Desconhecido'}
                        </span>`;
                    }).join('') + `</div>`;
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
                            ${t.name || 'Desconhecido'}
                        </span>`;
                    }).join('') + `</div>`;
            }

            const allTeam = [...(h.friendsTeammates || []), ...(h.randomTeammates || [])];
            const myStatsStr = JSON.stringify({ name: name, kills: h.kills, damage: h.damage, assists: h.assists, headshots: h.headshots, neymar: h.neymar }).replace(/"/g, '&quot;');
            const allTeamStr = JSON.stringify(allTeam).replace(/"/g, '&quot;');

            const actionButtons = `<div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                <span onclick="openMatchTimeline('${name.replace(/'/g, "\\'")}', '${h.matchId}'); event.stopPropagation();" 
                    style="background: #ffd700; color: #111; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: 900; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.3); transition: all 0.2s;"
                    onmouseover="this.style.background='#ffc933'" onmouseout="this.style.background='#ffd700'"
                    title="Ver linha do tempo da partida">
                    TIME LINE
                </span>
                ${allTeam.length > 0 ? `
                    <span onclick="toggleVersusAll('${matchRowId}', ${myStatsStr}, ${allTeamStr}); event.stopPropagation();" 
                        style="background: #ffd700; color: #111; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: 900; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"
                        title="Ver comparativo de toda a equipe">
                        TODOS
                    </span>` : ''}
            </div>`;

            teammatesHtml = `<div style="padding: 5px 0;">${egoHtml}${randomHtml}</div>`;
            if (!(h.friendsTeammates && h.friendsTeammates.length > 0) && !(h.randomTeammates && h.randomTeammates.length > 0)) {
                teammatesHtml = '<span style="color: #666; font-size: 10px;">-</span>';
            }

            const playerVictimsJson = JSON.stringify(h.playerVictims || []).replace(/"/g, '&quot;');
            const botVictimsJson    = JSON.stringify(h.botVictims    || []).replace(/"/g, '&quot;');

            return `
            <tr style="border-bottom: 1px solid #222;">
                <td style="color: #888; font-size: 11px; padding: 4px 0;">${timeStr}</td>
                <td style="text-align: center;">${h.died === 0 ? '<span class="victory-medal" style="font-size: 16px;">🥇</span>' : ''}</td>
                <td style="color: #fff; text-align: center;">${h.kills}</td>
                <td onmouseenter="openKillsModal('👤 Players', ${playerVictimsJson}, 'player', this)" onmouseleave="closeKillsModal()" style="color: ${h.playerKills !== null ? '#22c55e' : '#444'}; font-weight: ${h.playerKills !== null ? '700' : '400'}; font-size: 12px; cursor: default; user-select: none; text-align: center;">${h.playerKills !== null ? h.playerKills : '—'}</td>
                <td onmouseenter="openKillsModal('🤖 Bots', ${botVictimsJson}, 'bot', this)" onmouseleave="closeKillsModal()" style="color: ${h.botKills !== null ? '#ef4444' : '#444'}; font-weight: ${h.botKills !== null ? '700' : '400'}; font-size: 12px; cursor: default; user-select: none; text-align: center;">${h.botKills !== null ? h.botKills : '—'}</td>
                <td style="color: #ccc; text-align: center;">${h.headshots}</td>
                <td style="color: #aaa; text-align: center;">${h.damage}</td>
                <td style="color: #aaa; text-align: center;">${h.assists}</td>
                <td style="color: #aaa; text-align: center;">${h.neymar}</td>
                <td style="text-align: center; font-size: 11px;">
                    ${h.died === 0 ? '<span style="color: #22c55e; font-weight: 800;">WIN</span>' : `<span style="color: #ef4444;">${ID_NAMES[h.killerOfUser] || h.killerOfUser || 'Desconhecido'}</span>`}
                </td>
                <td style="text-align: center;" title="${h.mode}">${modeIcon}</td>
                <td style="vertical-align: middle;">${teammatesHtml}</td>
                <td style="text-align: center; vertical-align: middle; padding: 0 5px;">${actionButtons}</td>
            </tr>
            <tr id="${matchRowId}" class="comparison-row" style="display: none; background: #0c0c0c;">
                <td colspan="13" style="padding: 10px;">
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
                <td class="highlight-stat" style="text-align: center;">
                    <span style="font-size: 24px; font-weight: 900; color: #ffd700;">${stats.realKillsTotal || 0}</span>
                </td>
                <td><span style="color: #999;">Dano:</span> ${stats.damage.toLocaleString()}</td>
                <td><span style="color: #999;">Asst:</span> ${stats.assists}</td>
                <td><span style="color: #999;">Neymar:</span> ${stats.neymar}</td>
                <td><span style="color: #999;">Partidas:</span> ${stats.matches}</td>
                <td style="font-size: 11px; text-align: right;">${timeH}h ${timeM}m vivo</td>
            </tr>
            <tr id="history-${safeId}" class="player-history-row" style="display: none; background: #1a1a1a;">
                <td colspan="13" style="padding: 15px; border-radius: 8px;">
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
                                <th style="padding: 5px 0; width: 85px;">Data</th>
                                <th style="text-align: center; width: 40px;">WIN</th>
                                <th style="text-align: center; width: 40px;">Kills</th>
                                <th style="color: #22c55e; text-align: center; width: 60px;">Reais</th>
                                <th style="color: #ef4444; text-align: center; width: 60px;">Bots</th>
                                <th style="text-align: center; width: 50px;">HS</th>
                                <th style="text-align: center; width: 60px;">Dano</th>
                                <th style="text-align: center; width: 50px;">Asst</th>
                                <th style="text-align: center; width: 50px;">Ney</th>
                                <th style="text-align: center; width: 110px;">Assassino</th>
                                <th style="text-align: center; width: 55px;">Modo</th>
                                <th style="padding-left: 10px;">Companheiros</th>
                                <th style="text-align: center; width: 180px;">Ações</th>
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
        <table class="rank-table" style="font-size: 13px;">
            <thead>
                <tr style="border-bottom: 1px solid #333; color: #666; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
                    <th style="padding: 10px; width: 40px; text-align: center;">RK</th>
                    <th style="padding: 10px; text-align: left;">JOGADOR</th>
                    <th style="padding: 10px; text-align: center; color: #ffd700;">KILLS</th>
                    <th style="padding: 10px; text-align: left;">DANO</th>
                    <th style="padding: 10px; text-align: left;">ASST</th>
                    <th style="padding: 10px; text-align: left;">NEYMAR</th>
                    <th style="padding: 10px; text-align: left;">PARTIDAS</th>
                    <th style="padding: 10px; text-align: right;">TEMPO VIVO</th>
                </tr>
            </thead>
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
        <td colspan="13" style="padding: 10px;">
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
        <td colspan="13" style="padding: 10px;">
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
window.togglePlayerHistory = togglePlayerHistory;
window.toggleVersus = toggleVersus;
window.toggleVersusAll = toggleVersusAll;
window.loadPlayerData = loadPlayerData;
window.openMatchTimeline = openMatchTimeline;
window.closeTimelineModal = closeTimelineModal;

function openMatchTimeline(playerName, matchId) {
    const stats = currentAggregatedData[playerName];
    const match = stats?.history.find(h => h.matchId === matchId);
    
    const modal = document.getElementById('timelineModal');
    const body = document.getElementById('timelineModalBody');
    if (!modal || !body) return;

    if (!match || !match.timeline || match.timeline.length === 0) {
        body.innerHTML = `<div style="text-align:center; padding: 40px; color: #666; font-style: italic;">Desculpe, telemetria detalhada não disponível para esta partida.</div>`;
    } else {
        // Sort events by time
        const sorted = [...match.timeline].sort((a, b) => {
            const [mA, sA] = a.time.split(':').map(Number);
            const [mB, sB] = b.time.split(':').map(Number);
            return (mA * 60 + sA) - (mB * 60 + sB);
        });

        // Add Victory manually
        if (match.died === 0) {
            sorted.push({ type: 'victory', time: 'Fim', text: 'VITÓRIA! Sobreviveu até o último círculo.' });
        }

        body.innerHTML = sorted.map((e, index) => {
            let icon = '⚪'; let title = ''; let desc = ''; let badge = '';
            
            switch(e.type) {
                case 'kill':
                    icon = '🎯'; title = 'Inimigo Eliminado'; 
                    desc = `Eliminou <strong>${e.victim}</strong> usando ${e.weapon}${e.headshot ? ' <span style="color:#ffd700;">(HEADSHOT! 🎯)</span>' : ''}`;
                    badge = '<span class="timeline-badge badge-kill">Abate</span>';
                    break;
                case 'death':
                    icon = '💀'; title = 'Membro Eliminado';
                    desc = `<strong>${e.victim}</strong> foi eliminado por <strong>${e.killer}</strong> (${e.weapon})`;
                    badge = '<span class="timeline-badge badge-death">Morte</span>';
                    break;
                case 'knock':
                    icon = '💥'; title = 'Inimigo Nocauteado';
                    desc = `<strong>${e.killer}</strong> deixou <strong>${e.victim}</strong> em estado DBNO`;
                    badge = '<span class="timeline-badge badge-knock">Nocauteou</span>';
                    break;
                case 'get_knocked':
                    icon = '🚑'; title = 'Membro Nocauteado';
                    desc = `<strong>${e.victim}</strong> foi nocauteado por <strong>${e.killer}</strong>`;
                    badge = '<span class="timeline-badge badge-knock">Nocauteado</span>';
                    break;
                case 'revive':
                    icon = '💉'; title = 'Revivido (Squad)';
                    desc = `<strong>${e.victim}</strong> foi trazido de volta por <strong>${e.reviver}</strong>`;
                    badge = '<span class="timeline-badge badge-revive">Revive</span>';
                    break;
                case 'revive_other':
                    icon = '🤝'; title = 'Auxílio Médico';
                    desc = `<strong>${e.reviver}</strong> reviveu <strong>${e.victim}</strong>`;
                    badge = '<span class="timeline-badge badge-revive">Ajuda</span>';
                    break;
                case 'victory':
                    icon = '🏆'; title = 'WINNER WINNER CHICKEN DINNER!';
                    desc = 'Parabéns! A equipe alcançou o topo da partida.';
                    badge = '<span class="timeline-badge badge-win">Vitória</span>';
                    break;
            }

            return `
                <div class="timeline-item">
                    <div class="timeline-item-time">${e.time} MIN</div>
                    <div class="timeline-item-marker">
                        <div class="timeline-icon-box" style="border-color: ${e.type.includes('kill') ? '#27ae60' : e.type.includes('knock') ? '#f7b500' : e.type.includes('death') ? '#eb5757' : '#ffd700'}">${icon}</div>
                        <div class="timeline-line"></div>
                    </div>
                    <div class="timeline-card" style="border-left: 3px solid ${e.type.includes('revive') ? '#3b82f6' : 'transparent'};">
                        ${badge}
                        <h4>${title}</h4>
                        <p>${desc}</p>
                    </div>
                </div>`;
        }).join('');
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scroll
}

function closeTimelineModal() {
    const modal = document.getElementById('timelineModal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ── Kills Hover Popover ──
let _killsTimer = null;

function openKillsModal(title, names, type, el) {
    clearTimeout(_killsTimer);
    if (!names || names.length === 0) return;

    const overlay = document.getElementById('killsModal');
    const titleEl = document.getElementById('killsModalTitle');
    const bodyEl  = document.getElementById('killsModalBody');
    if (!overlay) return;

    // Position ABOVE the cell by default — arrow points down toward the cell
    const rect = el.getBoundingClientRect();
    const popW = 210;
    const estH = Math.min(names.length * 28 + 46, 270);

    let left = rect.left + rect.width / 2 - popW / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - popW - 8));

    // Arrow should point to center of the cell — compute horizontal offset within bubble
    const cellCenterX = rect.left + rect.width / 2;
    const arrowOffsetPct = Math.max(16, Math.min(cellCenterX - left, popW - 16));
    overlay.querySelector('.kills-modal').style.setProperty('--arrow-offset', arrowOffsetPct + 'px');

    overlay.classList.remove('flipped');
    let top = rect.top - estH - 14; // Above the cell + gap for arrow
    if (top < 8) {
        // Not enough room above → show below (arrow points up)
        top = rect.bottom + 14;
        overlay.classList.add('flipped');
    }

    overlay.style.left = left + 'px';
    overlay.style.top  = top  + 'px';

    // Title
    titleEl.textContent = title;
    titleEl.style.color = type === 'bot' ? '#ef4444' : '#22c55e';

    // Show victims in chronological order (#1, #2, #3...)
    const icon = type === 'bot' ? '🤖' : '🎯';
    bodyEl.innerHTML = names.map((n, i) =>
        `<div class="kill-entry">
            <span class="kill-icon">${icon}</span>
            <span class="kill-count" style="background:transparent; color:#555; font-size:10px; padding:0; min-width:22px; text-align:right;">#${i + 1}</span>
            <span class="kill-name">${n}</span>
        </div>`
    ).join('');

    overlay.classList.add('active');
}

function closeKillsModal(delay = 140) {
    if (delay === 0) {
        document.getElementById('killsModal')?.classList.remove('active');
        return;
    }
    _killsTimer = setTimeout(() => {
        document.getElementById('killsModal')?.classList.remove('active');
    }, delay);
}

function keepKillsModalOpen() {
    clearTimeout(_killsTimer);
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeKillsModal(0); });

window.openKillsModal    = openKillsModal;
window.closeKillsModal   = closeKillsModal;
window.keepKillsModalOpen = keepKillsModalOpen;



