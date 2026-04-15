"""
CityPulse Authority Agent — LangGraph-powered conversational interface
for managing city infrastructure issues via natural language commands.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from agent import AuthorityAgent
import uvicorn

app = FastAPI(
    title="CityPulse Authority Agent",
    description="LangGraph-based conversational agent for city authorities",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

agent = AuthorityAgent()


class ChatRequest(BaseModel):
    message: str
    issue_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    actions: list = []


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Process an authority command through the LangGraph agent."""
    result = await agent.process(request.message, request.issue_id)
    return ChatResponse(**result)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "authority-agent", "engine": "langgraph"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
