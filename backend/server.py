from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import asyncio
from typing import Optional, List, Dict, Any
from pydantic import BaseModel

app = FastAPI(title="Coral Stats API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# CoralMC API base URLs
CORALMC_API_V1 = "https://www.coralmc.it/api/v1"
CORALMC_API_V2 = "https://api.coralmc.it/api"

async def make_request(url: str) -> Dict[str, Any]:
    """Make HTTP request to CoralMC API"""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, timeout=15.0)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            raise HTTPException(status_code=500, detail=f"API request failed: {str(e)}")

def is_valid_username(username: str) -> bool:
    """Validate username format"""
    if len(username) < 3 or len(username) > 16:
        return False
    return username.replace("_", "").isalnum()

@app.get("/")
async def root():
    return {"message": "Coral Stats API - Tracking CoralMC Bedwars Statistics"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "coral-stats-api"}

@app.get("/api/player/{username}")
async def get_player_info(username: str):
    """Get basic player information"""
    if not is_valid_username(username):
        raise HTTPException(status_code=400, detail="Invalid username format")
    
    url = f"{CORALMC_API_V1}/stats/player/{username}"
    data = await make_request(url)
    
    if "message" in data:
        raise HTTPException(status_code=404, detail=data["message"])
    
    return data

@app.get("/api/player/{username}/bedwars")
async def get_bedwars_stats(username: str):
    """Get player's Bedwars statistics"""
    if not is_valid_username(username):
        raise HTTPException(status_code=400, detail="Invalid username format")
    
    url = f"{CORALMC_API_V1}/stats/bedwars/{username}"
    data = await make_request(url)
    
    if "message" in data:
        raise HTTPException(status_code=404, detail=data["message"])
    
    return data

@app.get("/api/player/{username}/bedwars/matches")
async def get_bedwars_matches(username: str):
    """Get player's recent Bedwars matches"""
    if not is_valid_username(username):
        raise HTTPException(status_code=400, detail="Invalid username format")
    
    url = f"{CORALMC_API_V1}/stats/bedwars/{username}/matches"
    data = await make_request(url)
    
    if "message" in data:
        raise HTTPException(status_code=404, detail=data["message"])
    
    return data

@app.get("/api/bedwars/leaderboard/{leaderboard_type}")
async def get_bedwars_leaderboard(leaderboard_type: str):
    """Get Bedwars leaderboard"""
    valid_types = ["winstreak", "highest-winstreak", "wins", "kills", "beds"]
    
    if leaderboard_type not in valid_types:
        raise HTTPException(status_code=400, detail=f"Invalid leaderboard type. Must be one of: {valid_types}")
    
    url = f"{CORALMC_API_V2}/leaderboard/bedwars/{leaderboard_type}"
    raw_data = await make_request(url)
    
    # Transform data to a consistent format
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
    
    url = f"{CORALMC_API_V1}/stats/player/search/{search_term}"
    data = await make_request(url)
    
    if "message" in data:
        return []
    
    return data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)