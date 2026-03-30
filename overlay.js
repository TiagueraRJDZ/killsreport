/**
 * PUBG Tracker PRO - Minimalist Wins Overlay Logic
 * Optimized for daily wins counter
 */

const API_KEY = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJmNTQyODZmMC1iM2U0LTAxMzctYjg4MC01ZmJlZDQ2ZWVjMzkiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTY3ODkxOTY2LCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6ImVyaWNrbWRzOC1nbWFpIn0.1aRSRA6OKyUVRKG-CuwuU8vPblihryupGCfAEW9w1z8";
const SHARD = "steam";
const BASE_URL = "https://api.pubg.com/shards/";

let lastRefresh = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const player = params.get('player') || 'TIAGUERArjdz'; 
    
    // Initial load
    refreshWins(player);
    
    // Auto-refresh every 10 seconds (as requested by user)
    setInterval(() => refreshWins(player), 10000);
});

async function refreshWins(player) {
    try {
        const pResponse = await fetch(`${BASE_URL}${SHARD}/players?filter[playerNames]=${player}`, {
            headers: { Authorization: API_KEY, Accept: "application/vnd.api+json" }
        });
        
        if (!pResponse.ok) throw new Error("API Error");
        
        const pData = await pResponse.json();
        const playerData = pData.data?.[0];
        if (!playerData) return;
        
        // Fetch last 20 matches to find all from today
        const matchIds = playerData.relationships?.matches?.data?.slice(0, 20).map(m => m.id) || [];
        if (matchIds.length === 0) return;

        const today = new Date().toISOString().split('T')[0];
        let totalWins = 0;

        // Fetch match details in parallel
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

        results.forEach(m => {
            if (!m || !m.data) return;
            
            const createdAt = m.data.attributes.createdAt.split('T')[0];
            
            // Only count if it's from today
            if (createdAt === today) {
                const participant = m.included?.find(inc => 
                    inc.type === "participant" && 
                    inc.attributes?.stats?.name.toLowerCase() === player.toLowerCase()
                );
                
                if (participant && (participant.attributes?.stats?.winPlace === 1 || participant.attributes?.stats?.winPlace === "1")) {
                    totalWins++;
                }
            }
        });

        document.getElementById('winsVal').innerText = totalWins;
        
        lastRefresh = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        document.getElementById('refreshTime').innerText = `Atualizado: ${lastRefresh}`;
        
    } catch (err) {
        console.error("Refresh error:", err);
    }
}
