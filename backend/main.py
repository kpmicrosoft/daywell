
# New endpoint: POST /openai-chat
from fastapi import Body
# New endpoint: POST /azure-agent
from fastapi import HTTPException
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# New endpoint: GET /status
from pydantic import BaseModel


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

@app.post("/openai-chat", summary="Azure OpenAI Chat", description="Get a chat completion from Azure OpenAI GPT-4.1.")
def openai_chat(
    user_message: str = Body(..., embed=True, description="The user's message to send to the assistant.")
):
    """
    Uses Azure OpenAI to generate a chat completion response.
    """
    try:
        from openai import AzureOpenAI

        subscription_key = "Do0xJMw0uoR9CgwByTeO928mnDafiwRXPZG9KS7jx0bKYfaY3ixnJQQJ99BIACYeBjFXJ3w3AAAAACOGPLM3"
        client = AzureOpenAI(
            api_version="2024-12-01-preview",
            azure_endpoint="https://daywell-ai.cognitiveservices.azure.com/",
            api_key=subscription_key,
        )
        deployment = "gpt-4.1"
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_message}
            ],
            max_completion_tokens=13107,
            temperature=1.0,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0,
            model=deployment
        )
        return {"response": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


class SimpleBearerTokenCredential:
    def __init__(self, token):
        self._token = token
    def get_token(self, *scopes, **kwargs):
        # Expires in 1 hour (3600 seconds)
        return AccessToken(self._token, 3600)



# Refactored: Accept token and user_message from request body
@app.post("/azure-agent", summary="Azure AI Agent Conversation", description="Starts a thread with Azure AI Agent and returns the conversation result.")
def azure_agent_conversation(
    token: str = Body(..., embed=True, description="Azure Bearer token for authentication."),
    user_message: str = Body("Hi User Agent", embed=True, description="The user's message to send to the agent.")
):
    """
    Demonstrates Azure AI ProjectClient usage and returns the conversation result as JSON.
    """
    try:
        from azure.ai.projects import AIProjectClient
        from azure.ai.agents.models import ListSortOrder

        credential = SimpleBearerTokenCredential(token)
        project = AIProjectClient(
            credential=credential,
            endpoint="https://daywell-ai.services.ai.azure.com/api/projects/daywell-ai-planner"
        )
        agent = project.agents.get_agent("asst_6kpuVo6jYlveT5gGBUQW2Jtw")
        thread = project.agents.threads.create()
        message = project.agents.messages.create(
            thread_id=thread.id,
            role="user",
            content=user_message
        )
        run = project.agents.runs.create_and_process(
            thread_id=thread.id,
            agent_id=agent.id
        )
        if run.status == "failed":
            return {"status": "failed", "error": run.last_error}
        else:
            messages = project.agents.messages.list(thread_id=thread.id, order=ListSortOrder.ASCENDING)
            result = []
            for message in messages:
                if getattr(message, "text_messages", None):
                    result.append({
                        "role": message.role,
                        "text": message.text_messages[-1].text.value
                    })
            return {"status": "success", "thread_id": thread.id, "conversation": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.responses import RedirectResponse

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




# New endpoint: POST /plan

from fastapi.responses import JSONResponse
import json
import os

@app.post(
    "/plan",
    summary="Get Family Trip Plan",
    description="Returns a static family trip plan for New York City as a JSON object.",
    response_description="A detailed trip plan for a family in New York City."
)
def create_plan():
    """
    Returns a static plan from plan_data.json as JSON response.
    - **trip**: Trip details including destination, duration, family members, and itinerary.
    """
    json_path = os.path.join(os.path.dirname(__file__), "plan_data.json")
    with open(json_path, "r", encoding="utf-8") as f:
        plan = json.load(f)
    return JSONResponse(content=plan)

