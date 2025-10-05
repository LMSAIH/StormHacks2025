import os
from dotenv import load_dotenv
import json
import sys
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
from pymongo import MongoClient

DEVELOPMENT_PERMITS_URL = (
    'https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/issued-building-permits/records?select=projectvalue%2C%20address%2C%20propertyuse%2C%20specificusecategory%2C%20geolocalarea%2C%20geom%2C%20permitnumbercreateddate%2C%20issuedate%2C%20permitelapseddays&where=issueyear%20%3D%202025%20AND%20typeofwork%20like%20"New%20Building"%20AND%20projectvalue%20>%20500000&order_by=issuedate%20DESC&limit=100&lang=en'
)
PARKS_URL = (
    'https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/parks/records?select=name%2C%20streetnumber%2C%20streetname%2C%20neighbourhoodname%2C%20hectare%2C%20googlemapdest&limit=100'
)
PUBLIC_ART_URL = (
    'https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/public-art/records?select=title_of_work%2C%20type%2C%20status%2C%20sitename%2C%20siteaddress%2C%20neighbourhood%2C%20geo_local_area%2C%20geom&limit=100'
)
COMMUNITY_CENTERS_URL = (
    'https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/community-centres/records?select=name%2C%20address%2C%20geo_local_area%2C%20geom&limit=100'
)
LIBRARIES_URL = (
    'https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/libraries/records?select=address%2C%20name%20%2C%20geo_local_area%2C%20geom&limit=100'
)
CULTURAL_SPACES_URL = (
    'https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/cultural-spaces/records?select=cultural_space_name%2C%20active_space%2C%20primary_use%2C%20address%2C%20local_area%2C%20square_feet%2C%20geom&limit=100'
)
PUBLIC_WASHROOMS_URL = (
    'https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/public-washrooms/records?select=park_name%2C%20location%2C%20geo_local_area%2C%20geom&limit=100'
)
RAPID_TRANSIT_STATIONS_URL = (
   'https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/rapid-transit-stations/records?select=station%2C%20geo_local_area%2C%20geom&limit=100'
)
SCHOOLS_URL = (
    'https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/schools/records?select=address%2C%20school_name%2C%20geom&limit=100'
)
FIRE_HALLS_URL = (
    'https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/fire-halls/records?select=name%2C%20address%2C%20geom&limit=100'
)

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


def get_data(url: str) -> None:
	# We'll store each page's normalized records as an entry in this list
	development_permits = []

	# determine limit from URL if present
	import re

	m = re.search(r"[?&]limit=(\d+)", url)
	limit = int(m.group(1)) if m else 20

	# remove any existing offset param (we'll append offsets ourselves)
	base = re.sub(r"([?&])offset=\d+", r"\1", url).rstrip("&")

	# Fetch next 10 offsets (pages)
	pages = 2
	for i in range(pages):
		offset = i * limit
		sep = "&" if "?" in base else "?"
		page_url = f"{base}{sep}offset={offset}"
		print(f"Fetching page {i+1} at offset={offset}...")

		req = Request(page_url, headers={"User-Agent": "python-fetch-script/1.0"})
		try:
			with urlopen(req, timeout=30) as resp:
				data = resp.read()
		except HTTPError as e:
			print(f"HTTP error: {e.code} {e.reason}", file=sys.stderr)
			break
		except URLError as e:
			print(f"URL error: {e.reason}", file=sys.stderr)
			break

		try:
			parsed = json.loads(data)
		except Exception as e:
			print(f"Failed to parse JSON: {e}", file=sys.stderr)
			print(data.decode(errors="replace"), file=sys.stderr)
			break

		# Extract records from 'results' or 'records' when present
		records = []
		if isinstance(parsed, dict):
			if "results" in parsed and isinstance(parsed["results"], list):
				records = parsed["results"]
			elif "records" in parsed and isinstance(parsed["records"], list):
				records = parsed["records"]

		if not records and isinstance(parsed, list):
			records = parsed

		# Normalize each record to its 'fields' dict when available
		normalized = []
		for item in records:
			if isinstance(item, dict):
				if "record" in item and isinstance(item["record"], dict):
					rec = item["record"].get("fields") or item["record"]
				elif "fields" in item:
					rec = item.get("fields") or item
				else:
					rec = item
				normalized.append(rec)
			else:
				normalized.append(item)

		# Append the completed page (one list) to development_permits
		development_permits.append(normalized)

	# After all pages have been fetched, flatten and save once
	flat_records = []
	for page in development_permits:
		if isinstance(page, list):
			flat_records.extend(page)
		else:
			flat_records.append(page)

	# out_path = "development_permits.json"
	# with open(out_path, "w", encoding="utf-8") as f:
	# 	json.dump(flat_records, f, ensure_ascii=False, indent=2)

	# print(f"\nSaved {len(flat_records)} development permit records to {out_path}")
	return flat_records

def get_data_parks(url: str) -> None:
	# We'll store each page's normalized records as an entry in this list
	development_permits = []

	# determine limit from URL if present
	import re

	m = re.search(r"[?&]limit=(\d+)", url)
	limit = int(m.group(1)) if m else 20

	# remove any existing offset param (we'll append offsets ourselves)
	base = re.sub(r"([?&])offset=\d+", r"\1", url).rstrip("&")

	# Fetch next 10 offsets (pages)
	pages = 2
	for i in range(pages):
		offset = i * limit
		sep = "&" if "?" in base else "?"
		page_url = f"{base}{sep}offset={offset}"
		print(f"Fetching page {i+1} at offset={offset}...")

		req = Request(page_url, headers={"User-Agent": "python-fetch-script/1.0"})
		try:
			with urlopen(req, timeout=30) as resp:
				data = resp.read()
		except HTTPError as e:
			print(f"HTTP error: {e.code} {e.reason}", file=sys.stderr)
			break
		except URLError as e:
			print(f"URL error: {e.reason}", file=sys.stderr)
			break

		try:
			parsed = json.loads(data)
		except Exception as e:
			print(f"Failed to parse JSON: {e}", file=sys.stderr)
			print(data.decode(errors="replace"), file=sys.stderr)
			break

		# Extract records from 'results' or 'records' when present
		records = []
		if isinstance(parsed, dict):
			if "results" in parsed and isinstance(parsed["results"], list):
				records = parsed["results"]
			elif "records" in parsed and isinstance(parsed["records"], list):
				records = parsed["records"]

		if not records and isinstance(parsed, list):
			records = parsed

		# Normalize each record to its 'fields' dict when available
		normalized = []
		for item in records:
			if isinstance(item, dict):
				if "record" in item and isinstance(item["record"], dict):
					rec = item["record"].get("fields") or item["record"]
				elif "fields" in item:
					rec = item.get("fields") or item
				else:
					rec = item
				normalized.append(rec)
			else:
				normalized.append(item)

		# Append the completed page (one list) to development_permits
		development_permits.append(normalized)

	# After all pages have been fetched, flatten and save once
	flat_records = []
	for page in development_permits:
		if isinstance(page, list):
			flat_records.extend(page)
		else:
			flat_records.append(page)

	# out_path = "development_permits.json"
	# with open(out_path, "w", encoding="utf-8") as f:
	# 	json.dump(flat_records, f, ensure_ascii=False, indent=2)

	# print(f"\nSaved {len(flat_records)} development permit records to {out_path}")
	return flat_records

def transform_parks_data(records):
	"""Transform parks data from googlemapdest format to geom GeoJSON format"""
	transformed_records = []
	for record in records:
		if isinstance(record, dict) and 'googlemapdest' in record:
			# Create a copy of the record
			new_record = record.copy()
			
			# Transform googlemapdest to geom format
			if 'googlemapdest' in new_record and isinstance(new_record['googlemapdest'], dict):
				lon = new_record['googlemapdest'].get('lon')
				lat = new_record['googlemapdest'].get('lat')
				
				if lon is not None and lat is not None:
					new_record['geom'] = {
						"type": "Feature",
						"geometry": {
							"coordinates": [lon, lat],
							"type": "Point"
						}
					}
				
				# Remove the original googlemapdest field
				del new_record['googlemapdest']
			
			transformed_records.append(new_record)
		else:
			transformed_records.append(record)
	
	return transformed_records

def insert_records_to_collection(collection, records, unique_key: str | None = None, upsert: bool = False):
	"""Insert a list of dict records into a pymongo Collection.

	Parameters:
	- collection: a pymongo Collection object (synchronous).
	- records: list of dicts to insert.
	- unique_key: if provided and upsert=True, use this key to upsert (match on this field).
	- upsert: if True, perform per-record upserts using unique_key; otherwise perform insert_many.

	Returns a dict with counts or raise exceptions from pymongo.
	NOTE: This helper expects a synchronous pymongo Collection. If you are using an async
	driver (Motor), use its async APIs instead.
	"""
	if not records:
		return {"inserted_count": 0}

	# Simple upsert path: update_one with upsert for each record
	if upsert:
		if not unique_key:
			raise ValueError("unique_key is required when upsert=True")

		upserted = 0
		modified = 0
		for rec in records:
			if unique_key not in rec:
				# if record lacks the unique key, insert it as-is
				res_ins = collection.insert_one(rec)
				if res_ins.inserted_id:
					upserted += 1
				continue

			filt = {unique_key: rec[unique_key]}
			# Use $set to replace fields while preserving _id when updating
			res = collection.update_one(filt, {"$set": rec}, upsert=True)
			# update_one doesn't always expose upserted_id depending on server/driver
			if getattr(res, "upserted_id", None):
				upserted += 1
			elif getattr(res, "modified_count", 0):
				modified += int(res.modified_count)

		return {"upserted": upserted, "modified": modified}

	# Bulk insert path
	try:
		res = collection.insert_many(records, ordered=False)
		return {"inserted_count": len(res.inserted_ids)}
	except Exception as e:
		# Re-raise with context
		raise


if __name__ == "__main__":
    insert_records_to_collection(development_permits_collection, get_data(DEVELOPMENT_PERMITS_URL))
    insert_records_to_collection(public_art_collection, get_data(PUBLIC_ART_URL))
    insert_records_to_collection(community_centers_collection, get_data(COMMUNITY_CENTERS_URL))
    insert_records_to_collection(libraries_collection, get_data(LIBRARIES_URL))
    insert_records_to_collection(cultural_spaces_collection, get_data(CULTURAL_SPACES_URL))
    insert_records_to_collection(public_washrooms_collection, get_data(PUBLIC_WASHROOMS_URL))
    insert_records_to_collection(rapid_transit_stations_collection, get_data(RAPID_TRANSIT_STATIONS_URL))
    insert_records_to_collection(schools_collection, get_data(SCHOOLS_URL))
    insert_records_to_collection(fire_halls_collection, get_data(FIRE_HALLS_URL))

    # Transform parks data from googlemapdest to geom format before inserting
    parks_data = get_data(PARKS_URL)
    transformed_parks_data = transform_parks_data(parks_data)
    insert_records_to_collection(parks_collection, transformed_parks_data)