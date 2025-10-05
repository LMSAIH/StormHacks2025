import os
from dotenv import load_dotenv
import json
import sys
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
from pymongo import MongoClient
import math
import time
from openai import OpenAI

load_dotenv()

openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    raise RuntimeError(
        "OPENAI_API_KEY not found. Set it in a .env file or export it in your environment."
    )

mongodb_url = os.getenv("MONGODB_URL")
if not mongodb_url:
    raise RuntimeError(
        "MONGODB_URL not found. Set it in a .env file or export it in your environment."
    )

OpenAIClient = OpenAI()

client = MongoClient(mongodb_url)
db = client.stormhacks2025

enhanced_development_permits_collection = db.get_collection("enhanced_development_permits")


if __name__ == "__main__":
    response = OpenAIClient.responses.create(
        model="gpt-4.1 nano",
        input="Tell me a three sentence bedtime story about a unicorn."
    )

    print(response)