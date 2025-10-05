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
    Get development permits that have corresponding impact reports, optionally filtered by distance from a given coordinate.
    
    Args:
        lon: Longitude coordinate (optional)
        lat: Latitude coordinate (optional)  
        distance: Maximum distance in kilometers (optional)
        
    Returns:
        JSON response with permits (that have impact reports) and total count
        
    Examples:
        GET /development-permits  # All permits with impact reports
        GET /development-permits?lon=-123.0911&lat=49.2778&distance=5  # Within 5km with impact reports
    """
    development_permits_collection = db.get_collection("development_permits")
    impact_reports_collection = db.get_collection("impact_reports")
    
    # Get all permit IDs that have impact reports
    impact_reports_cursor = impact_reports_collection.find({}, {"original_permit_id": 1})
    permit_ids_with_reports = set(report.get("original_permit_id") for report in impact_reports_cursor)
    
    permits = []
    
    # If coordinates and distance are provided, filter by distance
    if lon is not None and lat is not None and distance is not None:
        for permit in development_permits_collection.find():
            # Only include permits that have corresponding impact reports
            permit_id_str = str(permit.get("_id"))
            if permit_id_str not in permit_ids_with_reports:
                continue
                
            # Extract coordinates from permit geom field
            permit_lon, permit_lat = extract_coordinates_from_geom(permit.get('geom'))
            
            if permit_lon is not None and permit_lat is not None:
                # Calculate distance between given coordinates and permit location
                calc_distance = haversine_distance(lon, lat, permit_lon, permit_lat)
                
                if calc_distance is not None and calc_distance <= distance:
                    permit["_id"] = str(permit["_id"])  # Convert ObjectId to string
                    permit["distance_km"] = round(calc_distance, 3)  # Add distance to response
                    permit["has_impact_report"] = True  # Indicate that impact report exists
                    permits.append(permit)
    else:
        # Return all permits that have impact reports if no filtering parameters provided
        for permit in development_permits_collection.find():
            permit_id_str = str(permit.get("_id"))
            # Only include permits that have corresponding impact reports
            if permit_id_str in permit_ids_with_reports:
                permit["_id"] = str(permit["_id"])  # Convert ObjectId to string
                permit["has_impact_report"] = True  # Indicate that impact report exists
                permits.append(permit)
    
    # Sort by distance if distance filtering was applied
    if lon is not None and lat is not None and distance is not None:
        permits.sort(key=lambda x: x.get('distance_km', float('inf')))
    
    return {
        "total_count": len(permits),
        "total_permits_with_reports": len(permit_ids_with_reports),
        "filters_applied": {
            "longitude": lon,
            "latitude": lat,
            "max_distance_km": distance,
            "only_with_impact_reports": True
        },
        "permits": permits
    }
    
@app.get("/amenities")
async def get_amenities(
    lon: Optional[float] = None,
    lat: Optional[float] = None, 
    distance: Optional[float] = None
):
    """
    Get all amenities, optionally filtered by distance from a given coordinate.
    
    Args:
        lon: Longitude coordinate (optional)
        lat: Latitude coordinate (optional)  
        distance: Maximum distance in kilometers (optional)
        
    Returns:
        JSON response with amenities grouped by type and total count
        
    Examples:
        GET /amenities  # All amenities
        GET /amenities?lon=-123.0911&lat=49.2778&distance=2  # Within 2km
    """
    # Get all collection references
    collections = {
        'parks': db.get_collection("parks"),
        'public_art': db.get_collection("public_art"),
        'community_centers': db.get_collection("community_centers"),
        'libraries': db.get_collection("libraries"),
        'cultural_spaces': db.get_collection("cultural_spaces"),
        'public_washrooms': db.get_collection("public_washrooms"),
        'rapid_transit_stations': db.get_collection("rapid_transit_stations"),
        'schools': db.get_collection("schools"),
        'fire_halls': db.get_collection("fire_halls")
    }
    
    amenities = {
        'parks': [],
        'public_art': [],
        'community_centers': [],
        'libraries': [],
        'cultural_spaces': [],
        'public_washrooms': [],
        'rapid_transit_stations': [],
        'schools': [],
        'fire_halls': []
    }
    
    total_count = 0
    
    # Process each amenity type
    for amenity_type, collection in collections.items():
        for amenity in collection.find():
            # Convert ObjectId to string
            amenity["_id"] = str(amenity["_id"])
            
            # If coordinates and distance are provided, filter by distance
            if lon is not None and lat is not None and distance is not None:
                # Extract coordinates from amenity geom field
                amenity_lon, amenity_lat = extract_coordinates_from_geom(amenity.get('geom'))
                
                if amenity_lon is not None and amenity_lat is not None:
                    # Calculate distance between given coordinates and amenity location
                    calc_distance = haversine_distance(lon, lat, amenity_lon, amenity_lat)
                    
                    if calc_distance is not None and calc_distance <= distance:
                        amenity["distance_km"] = round(calc_distance, 3)  # Add distance to response
                        amenities[amenity_type].append(amenity)
                        total_count += 1
            else:
                # Return all amenities if no filtering parameters provided
                amenities[amenity_type].append(amenity)
                total_count += 1
    
    # Sort each amenity type by distance if distance filtering was applied
    if lon is not None and lat is not None and distance is not None:
        for amenity_type in amenities:
            amenities[amenity_type].sort(key=lambda x: x.get('distance_km', float('inf')))
    
    return {
        "total_count": total_count,
        "filters_applied": {
            "longitude": lon,
            "latitude": lat,
            "max_distance_km": distance
        },
        "amenities": amenities,
        "count_by_type": {
            amenity_type: len(amenity_list) 
            for amenity_type, amenity_list in amenities.items()
        }
    }
    
@app.get("/impact_reports/{permit_id}")
async def get_impact_reports(permit_id: str):
    """
    Get an impact report by original permit ID.
    
    Args:
        permit_id: The original permit ID to search for
        
    Returns:
        JSON response with the impact report data
        
    Raises:
        HTTPException: 404 if report not found
        
    Examples:
        GET /impact_reports/68e1f303607bd68421537e47
    """
    impact_reports_collection = db.get_collection("impact_reports")
    
    try:
        # Find the report by original_permit_id
        report = impact_reports_collection.find_one({"original_permit_id": permit_id})
        
        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Impact report for permit ID '{permit_id}' not found"
            )
        
        # Convert MongoDB document to JSON-serializable format
        def convert_mongodb_types(obj):
            """Recursively convert MongoDB types to JSON-serializable types."""
            if isinstance(obj, dict):
                # Handle MongoDB extended JSON types
                if "$oid" in obj:
                    return obj["$oid"]
                elif "$numberInt" in obj:
                    return int(obj["$numberInt"])
                elif "$numberDouble" in obj:
                    return float(obj["$numberDouble"])
                elif "$date" in obj:
                    return obj["$date"]
                else:
                    # Recursively process dictionary
                    return {key: convert_mongodb_types(value) for key, value in obj.items()}
            elif isinstance(obj, list):
                # Recursively process list items
                return [convert_mongodb_types(item) for item in obj]
            else:
                # Return primitive types as-is
                return obj
        
        # Convert the report using our conversion function
        converted_report = convert_mongodb_types(report)
        
        # Ensure _id is a string
        if "_id" in converted_report:
            converted_report["_id"] = str(converted_report["_id"])
        
        return {
            "success": True,
            "permit_id": permit_id,
            "report": converted_report
        }

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving impact report: {str(e)}"
        )