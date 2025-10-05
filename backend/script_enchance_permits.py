import os
from dotenv import load_dotenv
import json
import sys
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
from pymongo import MongoClient
import math
import time

load_dotenv()

mongodb_url = os.getenv("MONGODB_URL")
if not mongodb_url:
    raise RuntimeError(
        "MONGODB_URL not found. Set it in a .env file or export it in your environment."
    )

client = MongoClient(mongodb_url)
db = client.stormhacks2025

development_permits_collection = db.get_collection("development_permits")
parks_collection = db.get_collection("parks")
public_art_collection = db.get_collection("public_art")
community_centers_collection = db.get_collection("community_centers")
libraries_collection = db.get_collection("libraries")
cultural_spaces_collection = db.get_collection("cultural_spaces")
public_washrooms_collection = db.get_collection("public_washrooms")
rapid_transit_stations_collection = db.get_collection("rapid_transit_stations")
schools_collection = db.get_collection("schools")
fire_halls_collection = db.get_collection("fire_halls")


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
    
    # Handle simple coordinate format: {lon: x, lat: y}
    if 'lon' in geom_field and 'lat' in geom_field:
        return geom_field['lon'], geom_field['lat']
    
    return None, None


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


def euclidean_distance(lon1, lat1, lon2, lat2):
    """
    Calculate simple Euclidean distance between two points.
    Note: This is less accurate for geographic coordinates but faster to compute.
    
    Args:
        lon1, lat1: Coordinates of first point in decimal degrees
        lon2, lat2: Coordinates of second point in decimal degrees
        
    Returns:
        float: Distance in degrees (multiply by ~111 km for rough km conversion)
    """
    if None in [lon1, lat1, lon2, lat2]:
        return None
    
    return math.sqrt((lon2 - lon1)**2 + (lat2 - lat1)**2)


def calculate_distance_between_records(record1, record2, distance_type='haversine'):
    """
    Calculate distance between two database records using their geom fields.
    
    Args:
        record1, record2: MongoDB records with geom fields
        distance_type: 'haversine' for great circle distance or 'euclidean' for simple distance
        
    Returns:
        float: Distance in km (haversine) or degrees (euclidean), None if calculation fails
    """
    # Extract coordinates from both records
    lon1, lat1 = extract_coordinates_from_geom(record1.get('geom'))
    lon2, lat2 = extract_coordinates_from_geom(record2.get('geom'))
    
    if distance_type == 'haversine':
        return haversine_distance(lon1, lat1, lon2, lat2)
    elif distance_type == 'euclidean':
        return euclidean_distance(lon1, lat1, lon2, lat2)
    else:
        raise ValueError("distance_type must be 'haversine' or 'euclidean'")


def calculate_distance_between_geojson_points(dict1, dict2):
    """
    Calculate distance between two dictionaries with GeoJSON geom fields.
    
    Args:
        dict1, dict2: Dictionaries with geom fields in the format:
        {
            "title_of_work": "George Cunningham Memorial Sundial",
            "type": "Sculpture",
            "geom": {
                "type": "Feature",
                "geometry": {
                    "coordinates": [-123.14261, 49.28733],
                    "type": "Point"
                },
                "properties": {}
            }
        }
        
    Returns:
        float: Distance in kilometers using Haversine formula, None if calculation fails
    """
    # Extract coordinates from first dictionary
    geom1 = dict1.get('geom', {})
    coords1 = geom1.get('geometry', {}).get('coordinates', [])
    
    # Extract coordinates from second dictionary
    geom2 = dict2.get('geom', {})
    coords2 = geom2.get('geometry', {}).get('coordinates', [])
    
    # Validate coordinates
    if (not coords1 or len(coords1) < 2 or 
        not coords2 or len(coords2) < 2):
        return None
    
    lon1, lat1 = coords1[0], coords1[1]
    lon2, lat2 = coords2[0], coords2[1]
    
    return haversine_distance(lon1, lat1, lon2, lat2)


def find_nearby_amenities(target_record, collection, max_distance_km=1.0, limit=10):
    """
    Find amenities within a certain distance of a target location.
    
    Args:
        target_record: The record to search around (must have geom field)
        collection: MongoDB collection to search in
        max_distance_km: Maximum distance in kilometers
        limit: Maximum number of results to return
        
    Returns:
        list: List of nearby records with calculated distances
    """
    target_lon, target_lat = extract_coordinates_from_geom(target_record.get('geom'))
    
    if target_lon is None or target_lat is None:
        return []
    
    nearby_amenities = []
    
    # Fetch all records from the collection
    for record in collection.find():
        distance = calculate_distance_between_records(target_record, record, 'haversine')
        
        if distance is not None and distance <= max_distance_km and distance > 0:
            record_with_distance = record.copy()
            record_with_distance['distance_km'] = round(distance, 3)
            nearby_amenities.append(record_with_distance)
    
    # Sort by distance and limit results
    nearby_amenities.sort(key=lambda x: x['distance_km'])
    return nearby_amenities[:limit]


def analyze_development_permits_with_nearby_amenities(max_distance_km=2.0, limit_per_type=10):
    """
    For each development permit, find all nearby amenities and return permits with nearby buildings.
    
    Args:
        max_distance_km: Maximum distance to search for amenities (default 2km)
        limit_per_type: Maximum number of each amenity type to include
        
    Returns:
        list: List of development permits with nearby amenities added
    """
    enhanced_permits = []
    
    # Get all development permits
    permits = list(development_permits_collection.find())
    
    for i, permit in enumerate(permits):
        # Create enhanced permit with original data
        enhanced_permit = permit.copy()
        
        # Initialize buildings_nearby structure
        enhanced_permit['buildings_nearby'] = {
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
        
        # Find nearby amenities for each type
        amenity_collections = {
            'parks': parks_collection,
            'public_art': public_art_collection,
            'community_centers': community_centers_collection,
            'libraries': libraries_collection,
            'cultural_spaces': cultural_spaces_collection,
            'public_washrooms': public_washrooms_collection,
            'rapid_transit_stations': rapid_transit_stations_collection,
            'schools': schools_collection,
            'fire_halls': fire_halls_collection
        }
        
        for amenity_type, collection in amenity_collections.items():
            nearby = find_nearby_amenities(
                permit, 
                collection, 
                max_distance_km=max_distance_km, 
                limit=limit_per_type
            )
            enhanced_permit['buildings_nearby'][amenity_type] = nearby
        
        enhanced_permits.append(enhanced_permit)
    
    return enhanced_permits


def save_enhanced_permits_to_collection(enhanced_permits, collection_name="enhanced_development_permits"):
    """
    Save the enhanced development permits to a new MongoDB collection.
    
    Args:
        enhanced_permits: List of permits with nearby amenities
        collection_name: Name of the collection to save to
    """
    enhanced_collection = db.get_collection(collection_name)
    
    # Clear existing data
    enhanced_collection.delete_many({})
    
    # Insert enhanced permits
    if enhanced_permits:
        result = enhanced_collection.insert_many(enhanced_permits)
    
    return enhanced_collection


if __name__ == "__main__":
    # Start timing the execution
    start_time = time.time()
    
    # Main functionality: Analyze all development permits for nearby amenities
    
    # Analyze permits with nearby amenities (within 2km radius)
    enhanced_permits = analyze_development_permits_with_nearby_amenities(
        max_distance_km=0.5,  # Search within 2km
        limit_per_type=20      # Max 20 of each amenity type
    )
    
    # Save to new collection
    save_enhanced_permits_to_collection(enhanced_permits, "enhanced_development_permits")
    
    # Save results to JSON file
    output_file = "enhanced_development_permits.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(enhanced_permits, f, ensure_ascii=False, indent=2, default=str)
    
    # Calculate and save execution time
    end_time = time.time()
    execution_time = end_time - start_time
    
    print("execution_time_seconds:", round(execution_time, 2))