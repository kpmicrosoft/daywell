  # Daywell App


  ## Running the code

## Start the Frontend
  **Environment Variable:
  Configure your environment:
  ```
  VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
  ```

1. Open a terminal and navigate to the `frontend` directory:
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

## Start the Backend

1. Open a new terminal and navigate to the `backend` directory:
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


  ## Testing the /plan Endpoint

Here is a sample curl command to test the /plan endpoint:

This will send a POST request with the required JSON body. You should receive a JSON response with the itinerary.

```sh
curl -X POST "http://localhost:8000/plan" -H "Content-Type: application/json" -d '{"destination": "Paris", "days": 3}'
```