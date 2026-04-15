"""
LangGraph Authority Agent — Real LLM Integration
Uses Gemini via langchain-google-genai and LangGraph to route
commands and perform database operations.
"""
import os
from typing import Optional, List, Dict, Any
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.prebuilt import create_react_agent
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage

from tools import update_issue_status, get_issue_details, search_issues, verify_resolution


class AuthorityAgent:
    """
    Conversational agent powered by LangGraph and Gemini.
    It routes natural language questions/commands to the appropriate DB tools.
    """
    def __init__(self):
        from dotenv import load_dotenv
        load_dotenv(dotenv_path="../.env")
        gemini_api_key = os.getenv("GEMINI_API_KEY", "")
        if not gemini_api_key:
            print("WARNING: GEMINI_API_KEY environment variable is not set.")
            
        # Initialize Gemini LLM with tool-calling support
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            api_key=gemini_api_key,
            temperature=0.0
        )
        
        # Tools to bind to the LLM
        self.tools = [
            update_issue_status,
            get_issue_details,
            search_issues,
            verify_resolution
        ]
        
        # Build the LangGraph React Agent
        self.graph = create_react_agent(self.llm, tools=self.tools)

    async def process(self, message: str, issue_id: Optional[str] = None) -> dict:
        """
        Process the user message through the LangGraph agent and extract the
        response and actions taken.
        """
        prompt = message
        if issue_id:
            prompt += f"\n\nContext: The user is currently looking at issue ID: {issue_id}"
            
        inputs = {"messages": [HumanMessage(content=prompt)]}
        
        # Execute the graph
        result = await self.graph.ainvoke(inputs)
        
        # Extract the final output from the AI and track the actions (tool calls)
        final_message = ""
        actions: List[Dict[str, Any]] = []
        
        for msg in result["messages"]:
            if isinstance(msg, AIMessage) and msg.content:
                final_message = msg.content
                # If there were tool calls attached to this AI message, record them
                if hasattr(msg, "tool_calls") and msg.tool_calls:
                    for tc in msg.tool_calls:
                        actions.append({
                            "tool": tc.get("name", "unknown_tool"),
                            "status": "pending_or_success"
                        })
            elif isinstance(msg, ToolMessage):
                # Optionally mark the tool success based on tool return value
                for action in actions:
                    if action["tool"] == msg.name:
                        action["status"] = "success"
                        
        if not final_message:
            final_message = "I've processed your command and executed the necessary actions."
            
        return {
            "response": final_message,
            "actions": actions
        }
