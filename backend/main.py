
# FastAPI imports and setup
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, JSONResponse
from pydantic import BaseModel
import os
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


app = FastAPI()

# New endpoint: GET /family
from fastapi import Query

@app.get("/family", summary="Get Family Members for Member", description="Returns the other family members for a given member ID.")
def get_family(member_id: int = Query(..., description="The ID of the family member (1-based index).")):
    """
    Returns the other family members for a given member ID.
    """
    family = [
        {"id": 1, "full_name": "Alice Smith", "relationship": "Parent"},
        {"id": 2, "full_name": "Bob Smith", "relationship": "Parent"},
        {"id": 3, "full_name": "Charlie Smith", "relationship": "Child"},
        {"id": 4, "full_name": "Daisy Smith", "relationship": "Child"}
    ]
    member = next((m for m in family if m["id"] == member_id), None)
    if member:
        other_members = [m for m in family if m["id"] != member_id]
        return {
            "member_id": member["id"],
            "full_name": member["full_name"],
            "relationship": member["relationship"],
            "family_members": other_members
        }
    else:
        return {"error": f"No family member found with id {member_id}"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", include_in_schema=False)
def root():
    """Redirects to the Swagger UI documentation."""
    return RedirectResponse(url="/docs")


class StatusResponse(BaseModel):
    status: str

@app.get("/status", response_model=StatusResponse, summary="API Status", description="Check if the API is up.")
def get_status():
    """
    Returns the status of the API.
    - **status**: Always 'up' if the API is running.
    """
    return StatusResponse(status="up")

class TripRequest(BaseModel):
    destination: str
    startDate: str
    endDate: str
    budget: float
    activityPreferences: list
    travelers: list
    adults: list
    children: list
    adultsCount: int
    childrenCount: int
    specialRequests: str

@app.post(
    "/plan",
    summary="Create Family Trip Plan",
    description="Creates a family trip plan based on the provided trip data and returns a detailed itinerary.",
    response_description="A detailed trip plan customized for the family."
)
def create_plan(trip_request: TripRequest):
    """
    Creates a trip plan based on the provided trip data using Azure OpenAI.
    Falls back to static plan if AI generation fails.
    - **trip**: Trip details including destination, duration, family members, and itinerary.
    """
    print(f"Received trip request: {trip_request}")
    
    try:
        # Generate AI-powered itinerary
        from openai import AzureOpenAI
        from datetime import datetime, timedelta
        
        subscription_key = os.getenv("AZURE_AI_API_KEY")
        if not subscription_key:
            raise HTTPException(status_code=500, detail="Azure AI API key not found in environment variables")
            
        client = AzureOpenAI(
            api_version="2024-12-01-preview",
            azure_endpoint="https://daywell-ai.cognitiveservices.azure.com/",
            api_key=subscription_key,
        )
        
        # Calculate trip duration
        start_date = datetime.strptime(trip_request.startDate, "%Y-%m-%d")
        end_date = datetime.strptime(trip_request.endDate, "%Y-%m-%d")
        duration_days = (end_date - start_date).days + 1
        
        # Build family members description
        family_desc = []
        if trip_request.adults:
            family_desc.append(f"Adults: {', '.join(trip_request.adults)}")
        if trip_request.children:
            family_desc.append(f"Children: {', '.join(trip_request.children)}")
        
        # Create the AI prompt
        prompt = f"""You are a professional travel planner. Create a detailed family trip itinerary in JSON format.

        TRIP DETAILS:
        - Destination: {trip_request.destination}
        - Start Date: {trip_request.startDate}
        - End Date: {trip_request.endDate}
        - Duration: {duration_days} days
        - Budget: ${trip_request.budget:,.2f}
        - Family: {'; '.join(family_desc)}
        - Activity Preferences: {', '.join(trip_request.activityPreferences)}
        - Special Requests: {trip_request.specialRequests or 'None'}

        IMPORTANT REQUIREMENTS:
        1. Return ONLY valid JSON, no other text
        2. Include real, researchable locations with actual addresses
        3. Provide realistic coordinates (lat/lng) for destination
        4. Schedule activities with realistic timing (9 AM - 9:45 PM)
        5. Include family-friendly activities suitable for all ages in the group
        6. Balance indoor/outdoor activities
        7. Include meals (breakfast, lunch, dinner) with restaurant suggestions
        8. Keep within the specified budget range
        9. Use the EXACT JSON structure shown below

        JSON STRUCTURE:
        {{
        "trip": {{
            "destination": "{trip_request.destination}",
            "coordinates": {{"lat": 40.7831, "lng": -73.9712}},
            "startDate": "{trip_request.startDate}",
            "endDate": "{trip_request.endDate}",
            "duration": "{duration_days} days",
            "family_members": [
            {{"name": "Adult 1", "age": 35}},
            {{"name": "Child 1", "age": 8}}
            ],
            "itinerary": [
            {{
                "day": 1,
                "date": "{trip_request.startDate}",
                "activities": [
                {{
                    "id": "activity_1",
                    "type": "activity",
                    "title": "Activity Name",
                    "description": "Brief description of the activity",
                    "address": "Full street address",
                    "coordinates": {{"lat": 40.7831, "lng": -73.9712}},
                    "estimated_duration": "2 hours",
                    "sequenced_time": {{
                    "start": "09:00 AM",
                    "end": "11:00 AM"
                    }},
                    "tags": ["tag1", "tag2", "tag3"]
                }},
                {{
                    "id": "meal_1",
                    "type": "meal",
                    "title": "Restaurant Name",
                    "description": "Type of cuisine and why it's family-friendly",
                    "address": "Full restaurant address",
                    "coordinates": {{"lat": 40.7864, "lng": -73.9761}},
                    "estimated_duration": "1 hour",
                    "sequenced_time": {{
                    "start": "12:00 PM",
                    "end": "01:00 PM"
                    }},
                    "tags": ["food", "family-friendly", "cuisine-type"]
                }}
                ],
                "accommodation": "Suggested hotel name",
                "transportation": "Recommended transport method"
            }}
            ]
        }}
        }}

        Generate a complete {duration_days}-day itinerary following this exact format."""

        deployment = "gpt-4.1"
        
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are an expert travel planner specializing in family trips. Always respond with valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            max_completion_tokens=8000,
            temperature=0.7,
            model=deployment
        )
        
        ai_response = response.choices[0].message.content
        print(f"AI Response: {ai_response}")
        
        # Parse the JSON response
        try:
            plan = json.loads(ai_response)
            return JSONResponse(content=plan)
        except json.JSONDecodeError as json_error:
            print(f"JSON parsing error: {json_error}")
            print(f"Raw AI response: {ai_response}")
            raise HTTPException(status_code=500, detail="AI generated invalid JSON format")
            
    except Exception as e:
        print(f"AI generation failed: {str(e)}")
        # Fallback to static plan
        json_path = os.path.join(os.path.dirname(__file__), "plan_data.json")
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                plan = json.load(f)
            return JSONResponse(content=plan)
        except Exception as fallback_error:
            raise HTTPException(status_code=500, detail=f"Both AI generation and fallback failed: {str(e)}, {str(fallback_error)}")

