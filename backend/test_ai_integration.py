import json
import sys
import os

# Add the backend directory to the path
sys.path.append(os.path.dirname(__file__))

from main import TripRequest, create_plan

# Create a test trip request similar to what the frontend would send
test_request = TripRequest(
    destination="Paris, France",
    startDate="2025-09-25",
    endDate="2025-09-27",
    budget=2000.0,
    activityPreferences=["museums", "sightseeing", "family-friendly"],
    travelers=[
        {"id": 1, "full_name": "John Smith", "relationship": "Parent"},
        {"id": 2, "full_name": "Jane Smith", "relationship": "Parent"},
        {"id": 3, "full_name": "Emma Smith", "relationship": "Child"}
    ],
    adults=["John Smith", "Jane Smith"],
    children=["Emma Smith"],
    adultsCount=2,
    childrenCount=1,
    specialRequests="Please include kid-friendly restaurants and avoid too much walking"
)

print("Testing AI-powered itinerary generation...")
print(f"Request: {test_request}")
print("\n" + "="*50 + "\n")

try:
    # Call the create_plan function
    response = create_plan(test_request)
    
    # Extract the content from JSONResponse
    if hasattr(response, 'body'):
        content = json.loads(response.body.decode())
    else:
        content = response
        
    print("AI Generated Itinerary:")
    print(json.dumps(content, indent=2))
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()