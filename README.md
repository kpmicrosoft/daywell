
# Daywell App

## Overview
Daywell is a full-stack application for trip planning, featuring a React frontend and a FastAPI backend.

---

## Configuration

### Environment Variables
Set your Google Maps and PredictHQ API key in a `.env` file or your environment:
```
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
VITE_PREDICTHQ_API_KEY=your_predicthq_api_key_here
```

### Backend URL
The frontend uses a configurable backend URL in `src/config.ts`:
```
// For production (Azure):
export const BACKEND_BASE_URL = 'https://daywell-backend-gah8c4b3dzcbbtbf.eastus2-01.azurewebsites.net';
// For local development:
export const BACKEND_BASE_URL = 'http://localhost:8000';
```
Update this value if you deploy the backend elsewhere.  

---

## Running the Backend
1. Open a terminal and navigate to the `backend` directory:
   ```sh
   cd backend
   ```
2. (Optional) Create a virtual environment:
   ```sh
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install Python dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Start the FastAPI backend server:
   ```sh
   uvicorn main:app --reload
   ```

## Running the Frontend
1. Open a new terminal and navigate to the `frontend` directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend development server:
   ```sh
   npm run dev
   ```

---

## Testing the /plan Endpoint

You can test the `/plan` endpoint with curl. Replace the URL as needed:

**If testing locally:**
```
curl -X POST "http://localhost:8000/plan" -H "Content-Type: application/json" -d '{"destination": "Paris", "days": 3}'
```

**If using the deployed backend (Azure):**
```
curl -X POST "https://daywell-backend-gah8c4b3dzcbbtbf.eastus2-01.azurewebsites.net/plan" -H "Content-Type: application/json" -d '{"destination": "Paris", "days": 3}'
```