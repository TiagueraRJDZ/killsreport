/**
 * PUBG Tracker PRO - OBS Overlay Logic
 * Optimized for last 10 matches summary
 */

const API_KEY = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJmNTQyODZmMC1iM2U0LTAxMzctYjg4MC01ZmJlZDQ2ZWVjMzkiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTY3ODkxOTY2LCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6ImVyaWNrbWRzOC1nbWFpIn0.1aRSRA6OKyUVRKG-CuwuU8vPblihryupGCfAEW9w1z8";
const SHARD = "steam";
const BASE_URL = "https://api.pubg.com/shards/";

const mapMeta = {
    erangel_main: { name: "Erangel" },
    baltic_main: { name: "Erangel" },
    desert_main: { name: "Miramar" },
    savage_main: { name: "Sanhok" },
    dihorotok_main: { name: "Vikendi" },
    summerland_main: { name: "Karakin" },
    chimera_main: { name: "Paramo" },
    range_main: { name: "Camp Jackal" },
    kiki_main: { name: "Deston" },
    tiger_main: { name: "Taego" },
    neon_main: { name: "Rondo" },
    heaven_main: { name: "Haven" }
};

let lastRefresh = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const player = params.get('player') || 'TIAGUERArjdz'; // Default to TIAGUERArjdz

    document.getElementById('playerName').innerText = player;

    // Initial load
    refreshData(player);

    // Auto-refresh every 2 minutes
    setInterval(() => refreshData(player), 10000);
});

async function refreshData(player) {
    try {
        console.log(`Refreshing data for ${player}...`);
        const pResponse = await fetch(`${BASE_URL}${SHARD}/players?filter[playerNames]=${player}`, {
            headers: { Authorization: API_KEY, Accept: "application/vnd.api+json" }
        });

        if (!pResponse.ok) throw new Error("Erro ao buscar jogador.");

        const pData = await pResponse.json();
        const playerData = pData.data?.[0];
        if (!playerData) throw new Error("Jogador não encontrado.");

        const matchIds = playerData.relationships?.matches?.data?.slice(0, 10).map(m => m.id) || [];
        if (matchIds.length === 0) {
            document.getElementById('matchList').innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">Sem partidas recentes.</div>';
            return;
        }

        // Fetch match details
        const results = await Promise.all(matchIds.map(async (id) => {
            try {
                const res = await fetch(`${BASE_URL}${SHARD}/matches/${id}`, {
                    headers: { Authorization: API_KEY, Accept: "application/vnd.api+json" }
                });
                if (!res.ok) return null;
                return await res.json();
            } catch (e) {
                return null;
            }
        }));

        const validMatches = results.filter(m => m !== null);
        renderMatches(validMatches, player);

        lastRefresh = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        document.getElementById('refreshTime').innerText = `Atualizado: ${lastRefresh}`;

    } catch (err) {
        console.error("Erro no refresh:", err);
        document.getElementById('refreshTime').innerText = "Erro ao atualizar";
    }
}

function renderMatches(matches, playerName) {
    const list = document.getElementById('matchList');

    const html = matches.map((m, index) => {
        const participant = m.included?.find(inc =>
            inc.type === "participant" &&
            inc.attributes?.stats?.name.toLowerCase() === playerName.toLowerCase()
        );

        if (!participant) return '';

        const stats = participant.attributes.stats;
        const rank = stats.winPlace;
        const isWin = rank === 1;
        const kills = stats.kills;
        const damage = Math.round(stats.damageDealt);
        const mapName = (m.data?.attributes?.mapName || 'Map').toLowerCase();

        // Use mapMeta for display name
        const displayName = mapMeta[mapName]?.name || mapName.split('_')[0].charAt(0).toUpperCase() + mapName.split('_')[0].slice(1);

        return `
            <div class="match-card" style="animation-delay: ${index * 0.1}s">
                <div class="match-rank ${isWin ? 'rank-win' : ''}">#${rank}</div>
                <div class="match-details">
                    <div class="stat-group">
                        <span class="stat-val kills-val">${kills}</span>
                        <span class="stat-lbl">Abates</span>
                    </div>
                    <div class="stat-group">
                        <span class="stat-val damage-val">${damage}</span>
                        <span class="stat-lbl">Dano</span>
                    </div>
                    <div class="match-meta">
                        <div style="font-weight: 700;">${displayName}</div>
                        <div>${m.data.attributes.gameMode.toUpperCase()}</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    list.innerHTML = html;
}
