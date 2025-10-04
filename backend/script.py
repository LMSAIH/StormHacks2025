import json
import sys
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

DEVELOPMENT_PERMITS_URL = (
    'https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/issued-building-permits/records?select=projectvalue%2C%20address%2C%20propertyuse%2C%20specificusecategory%2C%20geolocalarea%2C%20geom%2C%20permitnumbercreateddate%2C%20issuedate%2C%20permitelapseddays&where=issueyear%20%3D%202025%20AND%20typeofwork%20like%20"New%20Building"%20AND%20projectvalue%20>%20500000&order_by=issuedate%20DESC&limit=100&lang=en'
)
PARKS_URL = (
    'https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/parks/records?select=name%2C%20streetnumber%2C%20streetname%2C%20neighbourhoodname%2C%20hectare%2C%20googlemapdest&limit=100'
)
PUBLIC_ART_URL = (
    'https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/public-art/records?select=title_of_work%2C%20type%2C%20status%2C%20sitename%2C%20siteaddress%2C%20neighbourhood%2C%20geo_local_area%2C%20geom&limit=100'
)


def get_development_permits(url: str) -> None:
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

	out_path = "development_permits.json"
	with open(out_path, "w", encoding="utf-8") as f:
		json.dump(flat_records, f, ensure_ascii=False, indent=2)

	print(f"\nSaved {len(flat_records)} development permit records to {out_path}")



if __name__ == "__main__":
	get_development_permits(DEVELOPMENT_PERMITS_URL)
