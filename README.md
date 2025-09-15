
  # Daywell App


  ## Running the code

## Start the Frontend

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