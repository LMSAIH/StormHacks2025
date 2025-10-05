import os
from dotenv import load_dotenv
import json
import sys
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
from pymongo import MongoClient
import math
import time
import asyncio
import aiohttp
from openai import AsyncOpenAI

load_dotenv()

PROMPT = """You are an expert urban planning data analyst. Your function is to process a building permit JSON and analyze its impact on EACH nearby infrastructure item by applying a multi-factor, reason-based analytical framework. Your core task is to move beyond simple formulas and apply nuanced, context-aware reasoning. For each item, you must consider both the potential positive and negative impacts, justifying why one may outweigh the other. The justification is the most important field; the impactScore must be a logical conclusion of the justification. Your entire output MUST be a single, valid JSON object. Do not include any text, explanations, or markdown outside of the JSON. OUTPUT JSON FORMAT: JSON { "AnalysisSummary": { "_id": "The original _id of the main building permit.", "title": "A concise summary of the development project.", "description": "A factual, 1-2 sentence description summarizing the 'projectdescription' field.", "overallImportance": "An integer from 1-10, calculated using the rubric below." }, "AnalyzedInfrastructure": [ { "_id": "The original _id of the infrastructure item, for linking.", "name": "The name of the infrastructure item.", "type": "The category of the infrastructure (e.g., 'parks', 'schools').", "impactScore": "An integer from -10 to 10, derived from your reasoned justification. -10 being terrible, 0 neutral, 10 very positive", "quantitativeImpact": "A string representing a plausible numerical impact (e.g., '~5% increase in enrollment' or 'Minor access disruption').", "justification": "A 1-2 sentence explanation of the reasoning that produced the impact score, weighing both positive and negative factors based on the principles below." } ] }"""

EXAMPLE='{"_id":"68e1f303607bd68421537e47","projectvalue":52568256.0,"address":"4330ARBUTUSSTREET,Vancouver,BCV6J4A2","projectdescription":"CertifiedProfessionalProgram-NewBuilding-Toconstructa7-storeybuildingofcareoccupancy(165dwellingunits)consistingof:\r\n1ststorey-dwellingunits;commonareasforresidentsincludingdining\r\n2ndto4thstoreys-suitesofcareoccupancy;commonareas\r\n5thto6thstoreys-dwellingunits\r\n7thstorey(rooftop)-indoor&outdooramenities\r\n\r\nallover1levelofundergroundparkingaccessedfromthelane.\r\n\r\nNotes:\r\n1.ThispermithasbeenreviewedundertheprovisionsofVBBL2019.\r\n2.Aradioantennasystemisrequired.\r\n3.AClass1CookingOperation(Grease-LadenVapours)isproposed,withacommercialkitchenexhaustsystemdesignedtoNFPA96standards(Type1hoods).\r\n\r\nSTAGEDCONSTRUCTION\r\nSTAGEI:Excavation&Shoring(S.Yoo)\r\nISSUED:Mar.5,2025\r\n\r\nSTAGEII:FullConstruction(S.Yoo)\r\nISSUED:Sept.17,2025","propertyuse":["InstitutionalUses"],"specificusecategory":["CommunityCareFacility-ClassB"],"geolocalarea":"ArbutusRidge","geom":{"type":"Feature","geometry":{"coordinates":[-123.15281,49.2472894],"type":"Point"},"properties":{}},"permitnumbercreateddate":"2024-10-04","issuedate":"2025-09-17","permitelapseddays":348,"distance_km":0.329}'

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

OpenAIClient = AsyncOpenAI()

client = MongoClient(mongodb_url)
db = client.stormhacks2025

enhanced_development_permits_collection = db.get_collection("enhanced_development_permits")
impact_reports_collection = db.get_collection("impact_reports")


async def generate_impact_analysis(permit_data):
    """
    Generate an impact analysis for a single development permit using OpenAI.
    
    Args:
        permit_data: Dictionary containing the permit information
        
    Returns:
        dict: Parsed JSON impact analysis or None if failed
    """
    try:
        # Convert permit data to JSON string
        permit_json = json.dumps(permit_data, default=str)
        
        # Use the async chat completions API
        response = await OpenAIClient.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": PROMPT
                },
                {
                    "role": "user", 
                    "content": f"Here is the development permit JSON to analyze:\n{permit_json}"
                }
            ],
            temperature=0.8,
            max_tokens=1500,
            response_format={"type": "json_object"}
        )
        
        # Extract and parse the response
        response_text = response.choices[0].message.content
        parsed_json = json.loads(response_text)
        
        # Add metadata
        parsed_json["generated_at"] = time.time()
        parsed_json["original_permit_id"] = str(permit_data.get("_id", ""))
        
        return parsed_json
        
    except json.JSONDecodeError as e:
        print(f"JSON parsing error for permit {permit_data.get('_id', 'unknown')}: {e}")
        return None
    except Exception as e:
        print(f"Error generating analysis for permit {permit_data.get('_id', 'unknown')}: {e}")
        return None


async def process_permits_batch(permits_batch, batch_num, total_batches):
    """
    Process a batch of permits concurrently.
    """
    print(f"Processing batch {batch_num}/{total_batches} ({len(permits_batch)} permits)")
    
    # Create async tasks for the batch
    tasks = []
    for permit in permits_batch:
        task = generate_impact_analysis(permit)
        tasks.append((permit, task))
    
    # Execute all tasks in the batch concurrently
    batch_results = []
    for permit, task in tasks:
        try:
            analysis = await task
            batch_results.append((permit, analysis, True))
        except Exception as e:
            print(f"Error processing permit {permit.get('_id', 'unknown')}: {e}")
            batch_results.append((permit, None, False))
    
    return batch_results


async def process_all_permits():
    """
    Process all enhanced development permits and generate impact analyses asynchronously.
    """
    start_time = time.time()
    
    print("Starting asynchronous impact report generation for all permits...")
    
    # Get total count
    total_count = enhanced_development_permits_collection.count_documents({})
    print(f"Total permits to process: {total_count}")
    
    if total_count == 0:
        print("No permits found in the collection.")
        return
    
    # Process permits in batches to avoid overwhelming the API
    batch_size = 10  # Process 10 permits concurrently
    processed_count = 0
    successful_count = 0
    failed_count = 0
    
    # List to store all analyses for JSON file
    all_analyses = []
    
    # Create filename with timestamp
    timestamp = time.strftime("%Y%m%d_%H%M%S")
    json_filename = f"impact_analyses_{timestamp}.json"
    
    # Fetch all permits and split into batches
    permits_list = list(enhanced_development_permits_collection.find({}))
    total_batches = (len(permits_list) + batch_size - 1) // batch_size
    
    # Process permits in batches
    for batch_num in range(total_batches):
        start_idx = batch_num * batch_size
        end_idx = min(start_idx + batch_size, len(permits_list))
        batch = permits_list[start_idx:end_idx]
        
        # Process the batch
        batch_results = await process_permits_batch(batch, batch_num + 1, total_batches)
        
        # Handle batch results
        for permit, analysis, success in batch_results:
            processed_count += 1
            
            if success and analysis:
                try:
                    # Save to impact_reports collection
                    impact_reports_collection.insert_one(analysis.copy())
                    
                    # Add to list for JSON file (create a copy to avoid MongoDB ObjectId issues)
                    json_analysis = analysis.copy()
                    all_analyses.append(json_analysis)
                    
                    successful_count += 1
                    print(f"✓ Permit {permit.get('_id', 'unknown')}: Successfully processed and saved analysis")
                except Exception as e:
                    print(f"✗ Permit {permit.get('_id', 'unknown')}: Error saving analysis: {e}")
                    failed_count += 1
            else:
                failed_count += 1
                print(f"✗ Permit {permit.get('_id', 'unknown')}: Failed to generate analysis")
        
        # Progress update
        progress_percent = (processed_count / total_count) * 100
        print(f"\nBatch {batch_num + 1}/{total_batches} completed")
        print(f"Overall Progress: {processed_count}/{total_count} ({progress_percent:.1f}%) | Success: {successful_count} | Failed: {failed_count}")
        
        # Small delay between batches to avoid overwhelming the API
        if batch_num < total_batches - 1:  # Don't sleep after the last batch
            await asyncio.sleep(1)
    
    # Save all analyses to JSON file
    try:
        print(f"\nSaving {len(all_analyses)} analyses to JSON file: {json_filename}")
        
        # Create the complete JSON structure
        json_output = {
            "metadata": {
                "generated_at": time.time(),
                "generation_date": time.strftime("%Y-%m-%d %H:%M:%S"),
                "total_permits_processed": processed_count,
                "successful_analyses": successful_count,
                "failed_analyses": failed_count,
                "success_rate_percent": (successful_count/processed_count)*100 if processed_count > 0 else 0,
                "execution_time_seconds": 0,  # Will be updated below
                "average_time_per_permit_seconds": 0  # Will be updated below
            },
            "impact_analyses": all_analyses
        }
        
        end_time = time.time()
        execution_time = end_time - start_time
        
        # Update timing information
        json_output["metadata"]["execution_time_seconds"] = execution_time
        json_output["metadata"]["average_time_per_permit_seconds"] = execution_time/processed_count if processed_count > 0 else 0
        
        # Write to JSON file
        with open(json_filename, 'w', encoding='utf-8') as f:
            json.dump(json_output, f, indent=2, ensure_ascii=False, default=str)
        
        print(f"✓ Successfully saved JSON file: {json_filename}")
        print(f"File contains {len(all_analyses)} impact analyses with metadata")
        
    except Exception as e:
        print(f"✗ Error saving JSON file: {e}")
    
    print(f"\n=== Processing Complete ===")
    print(f"Total permits processed: {processed_count}")
    print(f"Successful analyses: {successful_count}")
    print(f"Failed analyses: {failed_count}")
    print(f"Success rate: {(successful_count/processed_count)*100:.1f}%")
    print(f"Total execution time: {execution_time:.2f} seconds ({execution_time/60:.2f} minutes)")
    print(f"Average time per permit: {execution_time/processed_count:.2f} seconds")
    print(f"Output saved to:")
    print(f"  - MongoDB: stormhacks2025.impact_reports collection")
    print(f"  - JSON file: {json_filename}")


if __name__ == "__main__":
    asyncio.run(process_all_permits())