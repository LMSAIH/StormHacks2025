import os
from dotenv import load_dotenv
from typing import Optional, List

from fastapi import FastAPI, Body, HTTPException, status
from fastapi.responses import Response
from pydantic import ConfigDict, BaseModel, Field, EmailStr
from pydantic.functional_validators import BeforeValidator

from typing_extensions import Annotated

from pymongo import MongoClient
import math

load_dotenv()

print(os.getenv("MONGODB_URL"))

app = FastAPI(
    title="StormHacks2025 Backend",
    summary="Backend API for StormHacks2025 project",
)

mongodb_url = os.getenv("MONGODB_URL")
if not mongodb_url:
    raise RuntimeError(
        "MONGODB_URL not found. Set it in a .env file or export it in your environment."
    )

client = MongoClient(mongodb_url)
db = client.stormhacks2025

# Represents an ObjectId field in the database.
# It will be represented as a `str` on the model so that it can be serialized to JSON.
PyObjectId = Annotated[str, BeforeValidator(str)]

def haversine_distance(lon1, lat1, lon2, lat2):
    """
    Calculate the great circle distance between two points on Earth using the Haversine formula.
    
    Args:
        lon1, lat1: Coordinates of first point in decimal degrees
        lon2, lat2: Coordinates of second point in decimal degrees
        
    Returns:
        float: Distance in kilometers
    """
    if None in [lon1, lat1, lon2, lat2]:
        return None
    
    # Convert decimal degrees to radians
    lon1, lat1, lon2, lat2 = map(math.radians, [lon1, lat1, lon2, lat2])
    
    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    # Radius of Earth in kilometers
    r = 6371
    
    return c * r

def extract_coordinates_from_geom(geom_field):
    """
    Extract longitude and latitude from a geom field.
    
    Args:
        geom_field: Can be a dict with geometry.coordinates or a simple dict with lon/lat
        
    Returns:
        tuple: (longitude, latitude) or (None, None) if extraction fails
    """
    if not geom_field or not isinstance(geom_field, dict):
        return None, None
    
    # Handle GeoJSON format: geom.geometry.coordinates
    if 'geometry' in geom_field and isinstance(geom_field['geometry'], dict):
        coords = geom_field['geometry'].get('coordinates')
        if coords and isinstance(coords, list) and len(coords) >= 2:
            return coords[0], coords[1]  # [lon, lat]
    
    return None, None

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/development-permits")
async def get_development_permits(
    lon: Optional[float] = None,
    lat: Optional[float] = None, 
    distance: Optional[float] = None
):
    """
    Get development permits, optionally filtered by distance from a given coordinate.
    
    Args:
        lon: Longitude coordinate (optional)
        lat: Latitude coordinate (optional)  
        distance: Maximum distance in kilometers (optional)
        
    Returns:
        JSON response with permits and total count
        
    Examples:
        GET /development-permits  # All permits
        GET /development-permits?lon=-123.0911&lat=49.2778&distance=5  # Within 5km
    """
    development_permits_collection = db.get_collection("development_permits")
    permits = []
    
    # If coordinates and distance are provided, filter by distance
    if lon is not None and lat is not None and distance is not None:
        for permit in development_permits_collection.find():
            # Extract coordinates from permit geom field
            permit_lon, permit_lat = extract_coordinates_from_geom(permit.get('geom'))
            
            if permit_lon is not None and permit_lat is not None:
                # Calculate distance between given coordinates and permit location
                calc_distance = haversine_distance(lon, lat, permit_lon, permit_lat)
                
                if calc_distance is not None and calc_distance <= distance:
                    permit["_id"] = str(permit["_id"])  # Convert ObjectId to string
                    permit["distance_km"] = round(calc_distance, 3)  # Add distance to response
                    permits.append(permit)
    else:
        # Return all permits if no filtering parameters provided
        for permit in development_permits_collection.find():
            permit["_id"] = str(permit["_id"])  # Convert ObjectId to string
            permits.append(permit)
    
    # Sort by distance if distance filtering was applied
    if lon is not None and lat is not None and distance is not None:
        permits.sort(key=lambda x: x.get('distance_km', float('inf')))
    
    return {
        "total_count": len(permits),
        "filters_applied": {
            "longitude": lon,
            "latitude": lat,
            "max_distance_km": distance
        },
        "permits": permits
    }