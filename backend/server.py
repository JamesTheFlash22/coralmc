from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
import asyncio
from datetime import datetime

app = FastAPI(title="Coral Stats API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Base URL for CoralMC API
CORALMC_API_BASE = "https://www.coralmc.it/api/v1"
CORALMC_API_BASE_V2 = "https://api.coralmc.it/api"

# Pydantic models
class PlayerInfo(BaseModel):
    username: str
    joinDate: int
    lastSeen: Optional[int] = None
    lastServer: Optional[str] = None
    isOnline: bool
    isBanned: bool
    isStaff: bool
    isVip: bool

class BedwarsStats(BaseModel):
    id_player: int
    kills: int
    wins: int
    deaths: int
    coins: int
    final_kills: int
    final_deaths: int
    beds_broken: int
    played: int
    winstreak: int
    h_winstreak: int
    level: int
    level_rank: int
    total_players: int
    current_division: int
    current_division_exp: int
    past_divisions: Optional[str] = None
    clan_role: Optional[str] = None
    clan_name: Optional[str] = None
    clan_id: Optional[int] = None
    losses: int

class BedwarsMatch(BaseModel):
    match_id: int
    match_start: str
    match_end: str
    match_duration_seconds: int
    arena_name: str
    match_type_name: str
    player_team_name: str
    winning_team_name: str
    match_outcome: str

class LeaderboardEntry(BaseModel):
    position: int
    username: str
    stats: Dict[str, Any]
    clan: Optional[str] = None

def is_username_valid(username: str) -> bool:
    """Validate username format"""
    if len(username) < 3 or len(username) > 16:
        return False
    return username.replace("_", "").isalnum()

async def make_api_request(url: str) -> Dict[str, Any]:
    """Make HTTP request to CoralMC API"""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, timeout=10.0)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            raise HTTPException(status_code=500, detail=f"API request failed: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Coral Stats API is running!"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/api/player/{username}")
async def get_player_info(username: str):
    """Get basic player information"""
    if not is_username_valid(username):
        raise HTTPException(status_code=400, detail="Invalid username format")
    
    url = f"{CORALMC_API_BASE}/stats/player/{username}"
    data = await make_api_request(url)
    
    if "message" in data:
        raise HTTPException(status_code=404, detail=data["message"])
    
    return data

@app.get("/api/player/{username}/bedwars")
async def get_bedwars_stats(username: str):
    """Get player's Bedwars statistics"""
    if not is_username_valid(username):
        raise HTTPException(status_code=400, detail="Invalid username format")
    
    url = f"{CORALMC_API_BASE}/stats/bedwars/{username}"
    data = await make_api_request(url)
    
    if "message" in data:
        raise HTTPException(status_code=404, detail=data["message"])
    
    return data

@app.get("/api/player/{username}/bedwars/matches")
async def get_bedwars_matches(username: str):
    """Get player's recent Bedwars matches"""
    if not is_username_valid(username):
        raise HTTPException(status_code=400, detail="Invalid username format")
    
    url = f"{CORALMC_API_BASE}/stats/bedwars/{username}/matches"
    data = await make_api_request(url)
    
    if "message" in data:
        raise HTTPException(status_code=404, detail=data["message"])
    
    return data

@app.get("/api/bedwars/match/{match_id}")
async def get_bedwars_match_detail(match_id: int):
    """Get detailed information about a specific Bedwars match"""
    url = f"{CORALMC_API_BASE}/stats/bedwars/match/{match_id}"
    data = await make_api_request(url)
    
    if "message" in data:
        raise HTTPException(status_code=404, detail=data["message"])
    
    return data

@app.get("/api/bedwars/leaderboard/{leaderboard_type}")
async def get_bedwars_leaderboard(leaderboard_type: str):
    """Get Bedwars leaderboard"""
    valid_types = ["winstreak", "highest-winstreak", "wins", "kills", "beds"]
    
    if leaderboard_type not in valid_types:
        raise HTTPException(status_code=400, detail=f"Invalid leaderboard type. Must be one of: {valid_types}")
    
    url = f"{CORALMC_API_BASE_V2}/leaderboard/bedwars/{leaderboard_type}"
    raw_data = await make_api_request(url)
    
    # Transform the data to match our expected format
    leaderboard = []
    for i, player in enumerate(raw_data):
        entry = {
            "position": i + 1,
            "username": player["name"],
            "stats": {
                "level": player["livello"],
                "kills": player["kills"],
                "deaths": player["deaths"],
                "bedsBroken": player["beds"],
                "wins": player["wins"],
                "winstreak": player["winstreak"],
                "highestWinstreak": player["highest_winstreak"],
                "kdr": player["kdr"]
            },
            "clan": player.get("clan")
        }
        leaderboard.append(entry)
    
    return leaderboard

@app.get("/api/player/search/{search_term}")
async def search_players(search_term: str):
    """Search for players by username"""
    if len(search_term) < 3:
        raise HTTPException(status_code=400, detail="Search term must be at least 3 characters")
    
    url = f"{CORALMC_API_BASE}/stats/player/search/{search_term}"
    data = await make_api_request(url)
    
    if "message" in data:
        return []
    
    return data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)