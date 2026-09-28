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
let currentSearchedName = '';
let currentTeamPlayers = []; // [{ id, name }] da última busca, usado na aba Temporada

// "AAAA-MM-DD" no fuso local (a API manda UTC; depois das 21h em Brasília o dia UTC já virou)
function localDateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const playerInput = document.getElementById('playerInput');

    // Press enter to search
    playerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loadPlayerData(playerInput.value);
    });

    searchBtn.addEventListener('click', () => loadPlayerData(playerInput.value));

    // Tab Switching Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;

            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(target).classList.add('active');

            // Season stats are rate-limited: only fetched when the tab is opened
            if (target === 'season') loadSeasonWins();
        });
    });
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
        currentTeamPlayers = allPlayers.map(p => ({ id: p.id, name: p.attributes.name }));

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

        if (document.getElementById('season')?.classList.contains('active')) {
            loadSeasonWins();
        } else {
            renderSeasonPlaceholder();
        }

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
    statsLabel.innerText = officialName;
    currentSearchedName = officialName;
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
    
    // Daily Analysis Accumulators
    const allWins = [];
    const today = localDateKey(new Date());

    // 2. Process each match
    for (const m of matchDetails) {
        if (!m.data) continue;
        const matchData = m.data;
        const createdAt = matchData.attributes.createdAt.split("T")[0];

        const matchType = matchData.attributes.matchType;
        const gameMode = matchData.attributes.gameMode;
        const mapName = matchData.attributes.mapName;

        // Ignore TDM, Events, and Training modes (including Range_Main/Camp Jackal training ground)
        if (
            matchType === "event" ||
            matchType === "arcade" ||
            matchType === "training" ||
            mapName === "Range_Main" ||
            (gameMode && (gameMode.includes("training") || gameMode.includes("warmup")))
        ) {
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
                    hallOfFameAggr[name] = { kills: 0, damage: 0, assists: 0, neymar: 0, time: 0, matches: 0, headshots: 0, deaths: 0, wins: 0, history: [], weapons: {} };
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
                        winPlace: Number(p.attributes.stats.winPlace) || null,
                        timeSurvived: Math.floor(p.attributes.stats.timeSurvived || 0),
                        matchDuration: matchData.attributes.duration || 0,
                        botKills: null,
                        playerKills: null,
                        botVictims: [],
                        playerVictims: [],
                        killerOfUser: null,
                        playerNameForDaily: name
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
            kdHistory.push({ fullDate: matchData.attributes.createdAt, kills: 0 }); // Placeholder, filled later with real player kills
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
                                entry.timeline.push({ type: 'knock', time: timeStamp, killer: killerName, victim: victimName, weapon: ID_NAMES[weapon] || weapon });
                            }
                        }
                        if (hfMapV) {
                            const entry = (hallOfFameAggr[hfMapV].history || []).find(h => h.matchId === task.matchId);
                            if (entry) {
                                if (!entry.timeline) entry.timeline = [];
                                entry.timeline.push({ type: 'get_knocked', time: timeStamp, killer: killerName, victim: victimName, weapon: ID_NAMES[weapon] || weapon });
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
                        const victimLower = victimName.toLowerCase();
                        if (hfMapK) {
                            const pDataK = hallOfFameAggr[hfMapK];
                            const isBot = (e.victim?.character?.name || '').toLowerCase().includes('aipawn') ||
                                (e.victim?.accountId || '').startsWith('ai.') ||
                                botNamesInMatch.has(victimLower);

                            const hEntryK = (pDataK.history || []).find(h => h.matchId === task.matchId);
                            if (hEntryK) {
                                // Aggregating real weapons kills (players only) for the HoF player strictly for their last 20 matches
                                if (!isBot && weapon) {
                                    pDataK.weapons[weapon] = (pDataK.weapons[weapon] || 0) + 1;
                                }

                                if (hEntryK.botKills === null) hEntryK.botKills = 0; if (hEntryK.playerKills === null) hEntryK.playerKills = 0;
                                if (isBot) { hEntryK.botKills++; hEntryK.botVictims.push(victimName); } else { hEntryK.playerKills++; hEntryK.playerVictims.push(victimName); }
                            }
                        }
                        if (hfMapV) {
                            const hEntryV = (hallOfFameAggr[hfMapV].history || []).find(h => h.matchId === task.matchId);
                            if (hEntryV && killerName) hEntryV.killerOfUser = killerName;
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

            // Gather all wins found in match history
            if (h.died === 0) {
                // Check if this match is already in allWins (squad wins are shared)
                let winObj = allWins.find(w => w.matchId === h.matchId);
                if (!winObj) {
                    winObj = {
                        matchId: h.matchId,
                        time: h.fullDate,
                        mode: h.mode,
                        players: []
                    };
                    allWins.push(winObj);
                }
                
                // Add this player to the participants list for this win
                const pName = h.playerNameForDaily || Object.keys(hallOfFameAggr).find(key => hallOfFameAggr[key] === pData);
                if (pName && !winObj.players.some(p => p.name === pName)) {
                    winObj.players.push({
                        name: pName,
                        kills: h.playerKills || 0
                    });
                }
            }
        });
    });

    document.getElementById("pageLoader").classList.remove("active");
    currentAggregatedData = hallOfFameAggr; // Save for clicking
    renderHallOfFame(hallOfFameAggr);

    // Filter Wins of the Day for the Searched Player
    const winsToday = allWins.filter(w => 
        localDateKey(new Date(w.time)) === today &&
        w.players.some(p => p.name === officialName)
    );
    renderWinRegistry(winsToday);

    // Default dashboard (stats, weapons, chart) to searched player
    if (hallOfFameAggr[officialName]) {
        updateDashboard(officialName);
    } else {
        renderWeapons({});
        renderProgressionChart([]);
    }
}

// ── Helpers ──

const RANK_TITLES = ['Mior Siuuuu!!!', 'Lixinho', 'Verme', 'Inseto'];
const LAST_RANK_TITLE = 'Xupingole o lixo supremo';

const CHEVRON_SVG = `<svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>`;
const TROPHY_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/></svg>`;

function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// String safe to embed as a single-quoted JS argument inside an HTML attribute
function arg(value) {
    return esc(String(value ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'"));
}

function getMatch(playerName, matchId) {
    return currentAggregatedData[playerName]?.history?.find(h => h.matchId === matchId);
}

function modeLabel(mode) {
    if (!mode) return '-';
    const base = mode.includes('squad') ? 'Squad' : mode.includes('duo') ? 'Duo' : mode.includes('solo') ? 'Solo' : mode;
    return mode.includes('fpp') ? `${base} FPP` : base;
}

function formatMatchDate(fullDate) {
    if (!fullDate) return { date: '-', ago: '' };
    const d = new Date(fullDate);
    const diffMins = Math.floor((new Date() - d) / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const ago = diffHrs < 1 ? `${diffMins}m atrás` : diffHrs < 24 ? `${diffHrs}h atrás` : `${Math.floor(diffHrs / 24)}d atrás`;
    const pad = n => String(n).padStart(2, '0');
    return { date: `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`, ago };
}

function formatNumber(n) {
    return Number(n || 0).toLocaleString('pt-BR');
}

function updateText(id, val) {
    const el = document.getElementById(id);
    if (el) el.innerText = val;
}

// ── Dashboard ──

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
    updateText('hsVal', hs.replace('.', ',') + "%");
    updateText('statsTypeLabel', playerName);

    // Elite Arsenal (non-bot kills) and kills trend for this specific player
    renderWeapons(stats.weapons || {});

    const chartData = (stats.history || [])
        .map(h => ({ fullDate: h.fullDate, kills: h.playerKills || 0 }))
        .sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate))
        .slice(-20)
        .map(k => k.kills);
    renderProgressionChart(chartData);
}

function weaponDisplayName(id) {
    return ID_NAMES[id] || id.replace('Item_Weapon_', '').replace('Weap', '').replace('_C', '').replace('BP_', '');
}

function weaponImageUrl(id) {
    if (id.startsWith('Proj')) {
        const imgId = id.replace('Proj', 'Item_Weapon_').split('_C')[0] + '_C';
        return `https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Item/Equipment/Throwable/${imgId}.png`;
    }
    const imgId = id.replace('Weap', 'Item_Weapon_').split('_C')[0] + '_C';
    const finalImgId = imgId.startsWith('Item_Weapon_') ? imgId : 'Item_Weapon_' + imgId;
    return `https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Item/Weapon/Main/${finalImgId}.png`;
}

function renderWeapons(data) {
    const container = document.getElementById("weaponsGrid");
    if (!container) return;

    const top = Object.entries(data).sort((a, b) => b[1] - a[1]).slice(0, 8);

    if (top.length === 0) {
        container.innerHTML = '<p class="empty">Nenhum abate registrado.</p>';
        return;
    }

    const max = top[0][1];
    container.innerHTML = top.map(([id, count]) => {
        const name = weaponDisplayName(id);
        return `
            <div class="weapon-row">
                <span class="weapon-thumb"><img src="${weaponImageUrl(id)}" alt="" loading="lazy" onerror="this.remove()"></span>
                <span class="weapon-name" title="${esc(name)}">${esc(name)}</span>
                <span class="bar"><span style="width: ${Math.round(count / max * 100)}%"></span></span>
                <span class="weapon-count">${count}</span>
            </div>`;
    }).join('');
}

function renderProgressionChart(data) {
    const canvas = document.getElementById("kdTrendChart");
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }

    if (data.length === 0) {
        updateText('kdTrendAvg', '-');
        return;
    }

    const avg = data.reduce((a, b) => a + b, 0) / data.length;
    updateText('kdTrendAvg', avg.toFixed(1).replace('.', ','));

    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent-strong').trim() || '#D99A12';

    chartInstance = new Chart(canvas.getContext("2d"), {
        type: 'line',
        data: {
            labels: data.map((_, i) => `Partida ${i + 1}`),
            datasets: [{
                label: 'Kills',
                data: data,
                borderColor: accent,
                backgroundColor: 'rgba(240, 180, 60, 0.14)',
                fill: true,
                tension: 0.3,
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 4,
                pointBackgroundColor: accent
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            scales: {
                y: {
                    beginAtZero: true,
                    border: { display: false },
                    grid: { color: '#EEF0F2' },
                    ticks: { color: '#6B727C', precision: 0, font: { family: 'Outfit', size: 13 } }
                },
                x: { display: false }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#FFFFFF',
                    borderColor: '#D5D9DE',
                    borderWidth: 1,
                    titleColor: '#4B525B',
                    bodyColor: '#16181C',
                    displayColors: false,
                    titleFont: { family: 'Outfit' },
                    bodyFont: { family: 'Outfit' },
                    callbacks: { label: c => `${c.parsed.y} kills` }
                }
            }
        }
    });
}

function setLoading(isLoading) {
    const btn = document.getElementById('searchBtn');
    btn.innerText = isLoading ? "Buscando..." : "Buscar";
    btn.disabled = isLoading;
}

function resetStats() {
    ['killsVal', 'kdVal', 'winsVal', 'matchesVal', 'damageVal', 'hsVal'].forEach(id => updateText(id, "-"));
    document.getElementById("weaponsGrid").innerHTML = '<p class="empty">Carregando...</p>';
    document.getElementById("hallOfFameSection").hidden = true;
}

// ── Ranking (Hall of Fame) ──

function renderHallOfFame(data) {
    const section = document.getElementById("hallOfFameSection");
    const container = document.getElementById("hallOfFameContainer");

    const players = Object.entries(data);
    if (players.length === 0) {
        section.hidden = true;
        return;
    }

    section.hidden = false;

    // Sort historical matches by date (Newest first)
    players.forEach(([_, stats]) => {
        if (stats.history) {
            stats.history.sort((a, b) => new Date(b.fullDate) - new Date(a.fullDate));
        }
    });

    // Sort by Real Kills (primary) and Damage (secondary)
    const sorted = players.sort((a, b) => (b[1].realKillsTotal || 0) - (a[1].realKillsTotal || 0) || b[1].damage - a[1].damage);
    const maxKills = Math.max(1, sorted[0][1].realKillsTotal || 0);

    const rows = sorted.map(([name, stats], index) => {
        const isLast = index === sorted.length - 1 && sorted.length > 1;
        const title = index === 0 ? RANK_TITLES[0] : isLast ? LAST_RANK_TITLE : (RANK_TITLES[index] || '');

        const realKills = stats.realKillsTotal || 0;
        const kd = (realKills / Math.max(1, stats.deaths)).toFixed(2);
        const hsRate = realKills > 0 ? Math.round((stats.headshots / realKills) * 100) : 0;
        const timeH = Math.floor(stats.time / 3600);
        const timeM = String(Math.floor((stats.time % 3600) / 60)).padStart(2, '0');
        const safeId = name.replace(/[^a-zA-Z0-9]/g, '');
        const isSearched = name.toLowerCase() === currentSearchedName.toLowerCase();

        const classes = ['rank-item', index === 0 && 'is-top', isSearched && 'is-searched'].filter(Boolean).join(' ');
        const historyRows = (stats.history || []).map((h, i) => renderHistoryRow(name, h, `${safeId}-${i}`)).join('');

        return `
            <div class="${classes}" id="rank-${safeId}">
                <button class="rank-row rank-grid" onclick="togglePlayerHistory('${safeId}', '${arg(name)}')" aria-expanded="false" aria-controls="history-${safeId}">
                    <span class="rank-pos">${index + 1}</span>
                    <span class="rank-player">
                        <span class="rank-name">${esc(name)}</span>
                        ${title ? `<span class="title-pill">${title}</span>` : ''}
                    </span>
                    <span class="rank-kills">
                        <span class="mono">${realKills}</span>
                        <span class="bar"><span style="width: ${Math.round(realKills / maxKills * 100)}%"></span></span>
                    </span>
                    <span class="num">${kd}</span>
                    <span class="num dim col-extra">${formatNumber(stats.damage)}</span>
                    <span class="num dim col-extra">${stats.assists}</span>
                    <span class="num dim col-extra">${stats.neymar}</span>
                    <span class="num dim col-extra col-matches">${stats.matches}</span>
                    <span class="num dim col-extra col-time">${timeH}h ${timeM}m</span>
                    ${CHEVRON_SVG}
                </button>
                <div class="history-panel" id="history-${safeId}" hidden>
                    <div class="history-head">
                        <strong>${stats.matches} partidas de ${esc(name)}</strong>
                        <span class="caption">K/D <span class="mono strong">${kd}</span> · Headshots <span class="mono strong">${hsRate}%</span></span>
                    </div>
                    <div class="history-scroll">
                        <div class="history-table">
                            <div class="history-grid history-header">
                                <span>Data</span><span>Resultado</span><span>Kills</span>
                                <span class="num">HS</span><span class="num">Dano</span><span class="num">Assist.</span><span class="num">Knocks</span>
                                <span>Modo</span><span>Companheiros</span><span></span>
                            </div>
                            ${historyRows}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="rank-grid rank-header">
            <span>#</span><span>Jogador</span><span>Kills</span><span class="num">K/D</span>
            <span class="num col-extra">Dano</span><span class="num col-extra">Assist.</span><span class="num col-extra">Knocks</span>
            <span class="num col-extra col-matches">Partidas</span><span class="num col-extra col-time">Tempo vivo</span><span></span>
        </div>
        ${rows}
    `;
}

function renderHistoryRow(playerName, h, rowId) {
    const { date, ago } = formatMatchDate(h.fullDate);
    const n = arg(playerName);
    const m = arg(h.matchId);

    const result = h.died === 0
        ? '<span class="pill-win">Vitória</span>'
        : `<span class="killed-by">Morto por <span>${esc(ID_NAMES[h.killerOfUser] || h.killerOfUser || 'desconhecido')}</span></span>`;

    // Real vs bot kills come from telemetry; hover shows who was killed
    const killChip = (kind, count, label) => count > 0
        ? `<span class="kill-chip ${kind}" onmouseenter="openKillsModal('${n}', '${m}', '${kind}', this)" onmouseleave="closeKillsModal()">${count} ${label}</span>`
        : `<span class="kill-chip ${kind} is-empty">0 ${label}</span>`;

    const split = h.playerKills !== null
        ? `<span class="kills-split">${killChip('player', h.playerKills, 'jog')}${killChip('bot', h.botKills, 'bot')}</span>`
        : '<span class="kills-split muted">sem telemetria</span>';

    const mateChip = (t, random) =>
        `<button class="mate-chip${random ? ' random' : ''}" onclick="toggleVersus('${rowId}', '${n}', '${m}', '${arg(t.name)}')" title="Comparar com ${esc(t.name)}">${esc(t.name || 'Desconhecido')}</button>`;

    const mates = [
        ...(h.friendsTeammates || []).map(t => mateChip(t, false)),
        ...(h.randomTeammates || []).map(t => mateChip(t, true))
    ].join('') || '<span class="caption">-</span>';

    const hasTeam = (h.friendsTeammates || []).length + (h.randomTeammates || []).length > 0;

    return `
        <div class="history-grid history-row">
            <span class="match-date"><span class="mono">${date}</span><small>${ago}</small></span>
            <span>${result}</span>
            <span class="kills-cell"><span class="mono">${h.kills}</span>${split}</span>
            <span class="num dim">${h.headshots}</span>
            <span class="num dim">${h.damage}</span>
            <span class="num dim">${h.assists}</span>
            <span class="num dim">${h.neymar}</span>
            <span class="dim" title="${esc(h.mode)}">${modeLabel(h.mode)}</span>
            <span class="mates">${mates}</span>
            <span class="row-actions">
                <button class="btn-ghost" onclick="openMatchTimeline('${n}', '${m}')">Timeline</button>
                ${hasTeam ? `<button class="btn-ghost" onclick="toggleVersusAll('${rowId}', '${n}', '${m}')">Comparar time</button>` : ''}
            </span>
        </div>
        <div class="compare-panel" id="cmp-${rowId}" hidden></div>
    `;
}

function togglePlayerHistory(safeId, playerName) {
    const item = document.getElementById(`rank-${safeId}`);
    if (!item) return;

    const wasOpen = item.classList.contains('is-open');

    // Close all other player histories
    document.querySelectorAll('.rank-item.is-open').forEach(el => {
        el.classList.remove('is-open');
        el.querySelector('.history-panel').hidden = true;
        el.querySelector('.rank-row').setAttribute('aria-expanded', 'false');
    });

    if (!wasOpen) {
        item.classList.add('is-open');
        item.querySelector('.history-panel').hidden = false;
        item.querySelector('.rank-row').setAttribute('aria-expanded', 'true');
    }

    // Always update dashboard stats at the top
    updateDashboard(playerName);
}

// ── Versus ──

function statsOf(name, h) {
    return { name, kills: h.kills, damage: h.damage, assists: h.assists, headshots: h.headshots, neymar: h.neymar };
}

function closeComparePanels() {
    document.querySelectorAll('.compare-panel').forEach(panel => {
        panel.hidden = true;
        panel.dataset.key = '';
    });
}

// Opens the panel for `key`, or closes it if it's already showing that key
function openComparePanel(rowId, key, html) {
    const panel = document.getElementById(`cmp-${rowId}`);
    if (!panel) return;

    const wasOpen = !panel.hidden && panel.dataset.key === key;
    closeComparePanels();
    if (wasOpen) return;

    panel.innerHTML = html;
    panel.dataset.key = key;
    panel.hidden = false;
}

function toggleVersus(rowId, playerName, matchId, mateName) {
    const h = getMatch(playerName, matchId);
    const mate = [...(h?.friendsTeammates || []), ...(h?.randomTeammates || [])].find(t => t.name === mateName);
    if (!h || !mate) return;

    const me = statsOf(playerName, h);
    const row = (label, a, b) => `
        <div class="versus-row">
            <span class="${a > b ? 'better' : ''}">${a}</span>
            <span class="label">${label}</span>
            <span class="${b > a ? 'better' : ''}">${b}</span>
        </div>`;

    openComparePanel(rowId, `vs:${mateName}`, `
        <div class="versus-head"><span>${esc(me.name)}</span><span>vs</span><span>${esc(mate.name)}</span></div>
        ${row('Kills', me.kills, mate.kills)}
        ${row('Dano', me.damage, mate.damage)}
        ${row('Assistências', me.assists, mate.assists)}
        ${row('Headshots', me.headshots, mate.headshots)}
        ${row('Knocks', me.neymar, mate.neymar)}
    `);
}

function toggleVersusAll(rowId, playerName, matchId) {
    const h = getMatch(playerName, matchId);
    if (!h) return;

    const allPlayers = [statsOf(playerName, h), ...(h.friendsTeammates || []), ...(h.randomTeammates || [])];

    const rowsHtml = allPlayers.map(p => `
        <tr class="${p.name === playerName ? 'is-me' : ''}">
            <td>${esc(p.name)}</td>
            <td>${p.kills}</td>
            <td>${p.damage}</td>
            <td>${p.assists}</td>
            <td>${p.headshots}</td>
            <td>${p.neymar}</td>
        </tr>`).join('');

    openComparePanel(rowId, 'ALL', `
        <div class="compare-title">Comparativo do time nesta partida</div>
        <table class="team-table">
            <thead>
                <tr><th>Jogador</th><th>Kills</th><th>Dano</th><th>Assist.</th><th>HS</th><th>Knocks</th></tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
        </table>
    `);
}

// ── Match timeline ──

const TL_ICON_PATHS = {
    crosshair: '<circle cx="12" cy="12" r="7"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
    skull: '<path d="M12 3a8 8 0 0 0-8 8c0 2.4 1.1 4.3 3 5.5V20h10v-3.5c1.9-1.2 3-3.1 3-5.5a8 8 0 0 0-8-8z"/><path d="M10 20v-2M14 20v-2"/><circle cx="9" cy="11" r="1.3"/><circle cx="15" cy="11" r="1.3"/>',
    down: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>'
};

function tlIcon(name) {
    return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${TL_ICON_PATHS[name]}</svg>`;
}

// Each player's timeline only holds events where they are the killer, victim or reviver
const TIMELINE_TYPES = {
    kill: { cls: 't-kill', icon: 'crosshair', label: 'Abate', text: e => `Eliminou <strong>${esc(e.victim)}</strong>` },
    death: { cls: 't-death', icon: 'skull', label: 'Morte', text: e => `Eliminado por <strong>${esc(ID_NAMES[e.killer] || e.killer)}</strong>` },
    knock: { cls: 't-knock', icon: 'down', label: 'Knock', text: e => `Derrubou <strong>${esc(e.victim)}</strong>` },
    get_knocked: { cls: 't-knocked', icon: 'down', label: 'Derrubado', text: e => `Derrubado por <strong>${esc(ID_NAMES[e.killer] || e.killer)}</strong>` },
    revive: { cls: 't-revive', icon: 'plus', label: 'Revive', text: e => `Levantado por <strong>${esc(e.reviver)}</strong>` },
    revive_other: { cls: 't-revive', icon: 'plus', label: 'Revive', text: e => `Levantou <strong>${esc(e.victim)}</strong>` },
    victory: { cls: 't-victory', icon: 'trophy', label: 'Vitória', text: () => '<strong>Winner winner chicken dinner!</strong>' }
};

function timeToSecs(time) {
    const [m, s] = String(time).split(':').map(Number);
    return (m || 0) * 60 + (s || 0);
}

function secsToTime(secs) {
    return `${Math.floor(secs / 60)}:${String(Math.floor(secs % 60)).padStart(2, '0')}`;
}

function openMatchTimeline(playerName, matchId) {
    const match = getMatch(playerName, matchId);

    const modal = document.getElementById('timelineModal');
    const body = document.getElementById('timelineModalBody');
    if (!modal || !body) return;

    const { date } = formatMatchDate(match?.fullDate);
    updateText('timelineMeta', match ? `${playerName} · ${modeLabel(match.mode)} · ${date}` : playerName);

    if (!match) {
        body.innerHTML = '<p class="empty tl-empty">Partida não encontrada.</p>';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        return;
    }

    const events = [...(match.timeline || [])]
        .map(e => ({ ...e, secs: timeToSecs(e.time) }))
        .sort((a, b) => a.secs - b.secs);

    const lastEvent = events.length ? events[events.length - 1].secs : 0;
    const matchEnd = Math.max(match.matchDuration || 0, match.timeSurvived || 0, lastEvent, 1);
    const aliveUntil = match.died === 0 ? matchEnd : (match.timeSurvived || lastEvent);

    // ── Resumo ──
    const summary = `
        <div class="tl-summary">
            <div><small>Resultado</small>${match.died === 0
                ? '<span class="pill-win">Vitória</span>'
                : `<span class="tl-summary-value">${match.winPlace ? `${match.winPlace}º lugar` : 'Eliminado'}</span>`}</div>
            <div><small>Kills</small><span class="tl-summary-value mono">${match.kills}</span></div>
            <div><small>Dano</small><span class="tl-summary-value mono">${formatNumber(match.damage)}</span></div>
            <div><small>Tempo vivo</small><span class="tl-summary-value mono">${secsToTime(aliveUntil)}</span></div>
        </div>`;

    // ── Barra da partida: quando cada evento aconteceu ──
    const pct = secs => Math.min(100, Math.max(0, secs / matchEnd * 100)).toFixed(2);
    const marks = events.map(e => {
        const t = TIMELINE_TYPES[e.type];
        return t ? `<span class="tl-mark ${t.cls}" style="left: ${pct(e.secs)}%" title="${e.time} · ${t.label}"></span>` : '';
    }).join('');

    const track = `
        <div class="tl-track">
            <div class="tl-track-bar">
                <span class="tl-track-alive" style="width: ${pct(aliveUntil)}%"></span>
                ${marks}
            </div>
            <div class="tl-track-labels"><span>0:00</span><span>Fim da partida · ${secsToTime(matchEnd)}</span></div>
        </div>`;

    // ── Lista de eventos ──
    if (match.died === 0) {
        events.push({ type: 'victory', time: secsToTime(matchEnd), secs: matchEnd });
    }

    const list = events.length === 0
        ? '<p class="empty tl-empty">Telemetria detalhada não disponível para esta partida.</p>'
        : `<ol class="tl-list">${events.map(e => {
            const t = TIMELINE_TYPES[e.type];
            if (!t) return '';
            return `
                <li class="tl-event ${t.cls}">
                    <span class="tl-time">${e.time}</span>
                    <span class="tl-icon">${tlIcon(t.icon)}</span>
                    <div class="tl-body">
                        <span class="tl-text">${t.text(e)}</span>
                        <span class="tl-sub"><span class="tl-label">${t.label}</span>${e.headshot ? '<span class="tl-hs">Headshot</span>' : ''}</span>
                    </div>
                    ${e.weapon && e.weapon !== 'Desconhecido' ? `<span class="tl-weapon">${esc(e.weapon)}</span>` : ''}
                </li>`;
        }).join('')}</ol>`;

    body.innerHTML = summary + track + list;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scroll
}

function closeTimelineModal() {
    const modal = document.getElementById('timelineModal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ── Kills Hover Popover ──
let _killsTimer = null;

function openKillsModal(playerName, matchId, type, el) {
    clearTimeout(_killsTimer);
    const h = getMatch(playerName, matchId);
    const names = type === 'bot' ? h?.botVictims : h?.playerVictims;
    if (!names || names.length === 0) return;

    const overlay = document.getElementById('killsModal');
    const titleEl = document.getElementById('killsModalTitle');
    const bodyEl = document.getElementById('killsModalBody');
    if (!overlay) return;

    // Position ABOVE the cell by default — arrow points down toward the cell
    const rect = el.getBoundingClientRect();
    const popW = 220;
    const estH = Math.min(names.length * 30 + 44, 280);

    let left = rect.left + rect.width / 2 - popW / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - popW - 8));

    // Arrow should point to center of the cell — compute horizontal offset within bubble
    const cellCenterX = rect.left + rect.width / 2;
    const arrowOffset = Math.max(16, Math.min(cellCenterX - left, popW - 16));
    overlay.querySelector('.kills-modal').style.setProperty('--arrow-offset', arrowOffset + 'px');

    overlay.classList.remove('flipped');
    let top = rect.top - estH - 12;
    if (top < 8) {
        // Not enough room above → show below (arrow points up)
        top = rect.bottom + 12;
        overlay.classList.add('flipped');
    }

    overlay.style.left = left + 'px';
    overlay.style.top = top + 'px';

    titleEl.innerHTML = type === 'bot'
        ? '<span class="is-bot">Bots abatidos</span>'
        : '<span class="is-player">Jogadores abatidos</span>';

    // Show victims in chronological order
    bodyEl.innerHTML = names.map((victim, i) =>
        `<div class="kill-entry"><span class="kill-count">${i + 1}</span><span class="kill-name">${esc(victim)}</span></div>`
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

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeKillsModal(0);
        closeTimelineModal();
    }
});

// ── Wins do dia ──

function renderWinRegistry(wins) {
    const container = document.getElementById('podiumContainer');
    const highlight = document.getElementById('winCountHighlight');
    const listSection = document.getElementById('winsListSection');
    const list = document.getElementById('winsList');

    if (!container) return;

    const now = new Date();
    const todayLabel = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}`;

    if (highlight) {
        highlight.innerHTML = `
            <span class="win-hero-number">${wins.length}</span>
            <div>
                <h1 class="win-hero-title">${wins.length === 1 ? 'vitória hoje' : 'vitórias hoje'}</h1>
                <span class="caption">Partidas de hoje em que ${esc(currentSearchedName)} terminou em 1º · ${todayLabel}</span>
            </div>
        `;
    }

    if (wins.length === 0) {
        container.innerHTML = '<p class="empty">Nenhuma vitória encontrada hoje.</p>';
        if (listSection) listSection.hidden = true;
        return;
    }

    // ── Pódio: rank por vitórias, depois kills ──
    const playerStats = {};
    wins.forEach(win => {
        win.players.forEach(p => {
            if (!playerStats[p.name]) {
                playerStats[p.name] = { name: p.name, wins: 0, kills: 0 };
            }
            playerStats[p.name].wins++;
            playerStats[p.name].kills += p.kills;
        });
    });

    const ranked = Object.values(playerStats)
        .sort((a, b) => (b.wins - a.wins) || (b.kills - a.kills))
        .slice(0, 4);

    container.innerHTML = ranked.map((p, i) => `
        <div class="podium-card${i === 0 ? ' is-first' : ''}">
            <div class="podium-top">
                <span class="podium-rank">${i + 1}º lugar</span>
                ${i === 0 ? TROPHY_SVG : ''}
            </div>
            <span class="podium-name" title="${esc(p.name)}">${esc(p.name)}</span>
            <div class="podium-metrics">
                <div><small>Vitórias</small><span class="mono">${p.wins}</span></div>
                <div><small>Kills</small><span class="mono">${p.kills}</span></div>
                <div><small>Média</small><span class="mono">${(p.kills / p.wins).toFixed(1).replace('.', ',')}</span></div>
            </div>
        </div>
    `).join('');

    // ── Lista das partidas vencidas ──
    if (list && listSection) {
        const pad = n => String(n).padStart(2, '0');
        list.innerHTML = [...wins]
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .map(w => {
                const d = new Date(w.time);
                const players = [...w.players]
                    .sort((a, b) => b.kills - a.kills)
                    .map(p => `<span class="win-player">${esc(p.name)}<span class="mono">${p.kills} kills</span></span>`)
                    .join('');
                return `
                    <div class="win-row">
                        <span class="mono">${pad(d.getHours())}:${pad(d.getMinutes())}</span>
                        <span class="dim win-mode">${modeLabel(w.mode)}</span>
                        <span class="win-players">${players}</span>
                        <button class="btn-ghost" onclick="openMatchTimeline('${arg(currentSearchedName)}', '${arg(w.matchId)}')">Timeline</button>
                    </div>`;
            }).join('');
        listSection.hidden = false;
    }
}

// ── Temporada ──
// Season stats come from /seasons/{id}/gameMode/{mode}/players, which takes up to 10
// player ids per call. These endpoints count toward the API key's rate limit
// (10 req/min), so results are cached and only fetched when the tab is opened.

const SEASON_MODES = ['solo', 'solo-fpp', 'duo', 'duo-fpp', 'squad', 'squad-fpp'];
const SEASON_CACHE_KEY = 'pubgCurrentSeason';
let seasonCache = { key: '', data: null };
let seasonLoading = false;

async function apiGet(path) {
    const res = await fetch(`${BASE_URL}${SHARD}${path}`, {
        headers: { Authorization: API_KEY, Accept: "application/vnd.api+json" }
    });
    if (res.status === 429) throw new Error('RATE_LIMIT');
    if (!res.ok) throw new Error(`Erro ${res.status} na API do PUBG.`);
    return res.json();
}

async function getCurrentSeasonId() {
    // The season list only changes once a month; keep it for 12h
    try {
        const cached = JSON.parse(localStorage.getItem(SEASON_CACHE_KEY) || 'null');
        if (cached && Date.now() - cached.at < 12 * 3600 * 1000) return cached.id;
    } catch (e) { /* storage unavailable */ }

    const data = await apiGet('/seasons');
    const current = (data.data || []).find(s => s.attributes?.isCurrentSeason);
    if (!current) throw new Error('Temporada atual não encontrada.');

    try {
        localStorage.setItem(SEASON_CACHE_KEY, JSON.stringify({ id: current.id, at: Date.now() }));
    } catch (e) { /* storage unavailable */ }
    return current.id;
}

function seasonLabel(seasonId) {
    const num = String(seasonId).match(/-(\d+)$/);
    return num ? `Temporada ${num[1]}` : 'Temporada atual';
}

function renderSeasonPlaceholder(message = 'Abra esta aba depois de buscar um jogador.') {
    const container = document.getElementById('seasonContainer');
    if (container) container.innerHTML = `<p class="empty pad">${message}</p>`;
}

async function loadSeasonWins(force = false) {
    const container = document.getElementById('seasonContainer');
    if (!container) return;

    if (currentTeamPlayers.length === 0) {
        renderSeasonPlaceholder('Busque um jogador para ver as vitórias da temporada.');
        return;
    }

    const players = currentTeamPlayers.slice(0, 10);
    const key = players.map(p => p.id).sort().join(',');
    if (!force && seasonCache.key === key && seasonCache.data) {
        renderSeasonWins(seasonCache.data);
        return;
    }
    if (seasonLoading) return;

    seasonLoading = true;
    renderSeasonPlaceholder('Carregando vitórias da temporada...');

    try {
        const seasonId = await getCurrentSeasonId();

        const stats = {};
        players.forEach(p => {
            stats[p.id] = { name: p.name, wins: 0, rounds: 0, top10s: 0, kills: 0, byMode: { squad: 0, duo: 0, solo: 0 } };
        });

        const ids = players.map(p => p.id).join(',');
        const results = await Promise.all(SEASON_MODES.map(mode =>
            apiGet(`/seasons/${seasonId}/gameMode/${mode}/players?filter[playerIds]=${ids}`).then(data => ({ mode, data }))
        ));

        results.forEach(({ mode, data }) => {
            (data.data || []).forEach(entry => {
                const s = stats[entry.relationships?.player?.data?.id];
                const g = entry.attributes?.gameModeStats?.[mode];
                if (!s || !g) return;
                s.wins += g.wins || 0;
                s.rounds += g.roundsPlayed || 0;
                s.top10s += g.top10s || 0;
                s.kills += g.kills || 0;
                s.byMode[mode.split('-')[0]] += g.wins || 0;
            });
        });

        seasonCache = { key, data: { seasonId, players: Object.values(stats) } };
        renderSeasonWins(seasonCache.data);
    } catch (err) {
        console.error(err);
        const msg = err.message === 'RATE_LIMIT'
            ? 'A API do PUBG limitou as consultas por agora. Espere cerca de 1 minuto e tente de novo.'
            : `Não foi possível carregar a temporada. ${esc(err.message)}`;
        container.innerHTML = `
            <div class="empty pad season-error">
                <span>${msg}</span>
                <button class="btn-ghost" onclick="loadSeasonWins(true)">Tentar de novo</button>
            </div>`;
    } finally {
        seasonLoading = false;
    }
}

function renderSeasonWins({ seasonId, players }) {
    const container = document.getElementById('seasonContainer');
    const sorted = [...players].sort((a, b) => (b.wins - a.wins) || (b.top10s - a.top10s) || (b.kills - a.kills));
    const maxWins = Math.max(1, sorted[0]?.wins || 0);
    const label = seasonLabel(seasonId);

    updateText('seasonLabel', `${label} · partidas normais, todos os modos`);

    const me = players.find(p => p.name.toLowerCase() === currentSearchedName.toLowerCase());
    updateText('seasonHeroNumber', me ? me.wins : '-');
    updateText('seasonHeroTitle', me && me.wins === 1 ? 'vitória na temporada' : 'vitórias na temporada');
    updateText('seasonHeroCaption', me
        ? `${me.name} · ${label} · ${me.rounds} partidas jogadas`
        : label);

    const rows = sorted.map((p, i) => {
        const winRate = p.rounds ? (p.wins / p.rounds * 100).toFixed(1).replace('.', ',') : '0,0';
        const classes = ['rank-item', i === 0 && p.wins > 0 && 'is-top', me && p.name === me.name && 'is-searched'].filter(Boolean).join(' ');
        return `
            <div class="${classes}">
                <div class="season-grid season-row">
                    <span class="rank-pos">${i + 1}</span>
                    <span class="rank-name">${esc(p.name)}</span>
                    <span class="rank-kills">
                        <span class="mono">${p.wins}</span>
                        <span class="bar"><span style="width: ${Math.round(p.wins / maxWins * 100)}%"></span></span>
                    </span>
                    <span class="num">${winRate}%</span>
                    <span class="num dim col-extra">${p.rounds}</span>
                    <span class="num dim col-extra">${p.top10s}</span>
                    <span class="num dim col-extra">${formatNumber(p.kills)}</span>
                    <span class="num dim col-extra">${p.byMode.squad}</span>
                    <span class="num dim col-extra">${p.byMode.duo}</span>
                    <span class="num dim col-extra">${p.byMode.solo}</span>
                </div>
            </div>`;
    }).join('');

    container.innerHTML = `
        <div class="season-grid rank-header">
            <span>#</span><span>Jogador</span><span>Vitórias</span><span class="num">% vitória</span>
            <span class="num col-extra">Partidas</span><span class="num col-extra">Top 10</span><span class="num col-extra">Kills</span>
            <span class="num col-extra">Squad</span><span class="num col-extra">Duo</span><span class="num col-extra">Solo</span>
        </div>
        ${rows}
    `;
}

// Export functions to global scope for HTML event handlers
window.loadSeasonWins = loadSeasonWins;
window.loadPlayerData = loadPlayerData;
window.togglePlayerHistory = togglePlayerHistory;
window.toggleVersus = toggleVersus;
window.toggleVersusAll = toggleVersusAll;
window.openMatchTimeline = openMatchTimeline;
window.closeTimelineModal = closeTimelineModal;
window.openKillsModal = openKillsModal;
window.closeKillsModal = closeKillsModal;
window.keepKillsModalOpen = keepKillsModalOpen;

// Add scroll-to-top on tab change
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
