import os
from dotenv import load_dotenv
from typing import Optional, List

from fastapi import FastAPI, Body, HTTPException, status
from fastapi.responses import Response
from pydantic import ConfigDict, BaseModel, Field, EmailStr
from pydantic.functional_validators import BeforeValidator

from typing_extensions import Annotated

from bson import ObjectId
import asyncio
from pymongo import AsyncMongoClient
from pymongo import ReturnDocument

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

client = AsyncMongoClient(mongodb_url)
db = client.college
student_collection = db.get_collection("students")

# Represents an ObjectId field in the database.
# It will be represented as a `str` on the model so that it can be serialized to JSON.
PyObjectId = Annotated[str, BeforeValidator(str)]

@app.get("/")
async def root():
    return {"message": "Hello World"}