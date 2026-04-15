"""
Tools for the CityPulse Authority Agent.
These tools interface with the MongoDB database and ML microservice.
"""
from typing import Optional
import httpx
import os
from langchain_core.tools import tool

MONGO_API_URL = os.getenv("API_URL", "http://localhost:5000/api")
ML_SERVICE_URL = os.getenv("ML_URL", "http://localhost:8000")


@tool
async def update_issue_status(
    issue_id: Optional[str] = None,
    status: str = "in-progress",
    location: str = "",
    message: str = "",
) -> str:
    """
    Update an issue's status in the database.
    This is the `updateDatabase` tool called by the LangGraph agent.
    """
    try:
        if issue_id:
            async with httpx.AsyncClient() as client:
                response = await client.put(
                    f"{MONGO_API_URL}/issues/{issue_id}",
                    json={
                        "status": status,
                        "updateMessage": f"Authority update: {message}",
                        "updatedBy": "authority-agent",
                    },
                    timeout=10.0,
                )
                if response.status_code == 200:
                    return f"Issue {issue_id} updated to {status}"
        else:
            return "Please provide an issue_id to update."
    except Exception as e:
        return f"Database error (could not connect to Express API): {str(e)}"


@tool
async def get_issue_details(issue_id: str) -> str:
    """Retrieve details for a specific issue from the database by its ID."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{MONGO_API_URL}/issues/{issue_id}",
                timeout=10.0,
            )
            if response.status_code == 200:
                return str(response.json())
            else:
                return f"Error: {response.status_code} {response.text}"
    except Exception as e:
        return f"Database connection error: {str(e)}"


@tool
async def search_issues(
    category: Optional[str] = None,
    severity: Optional[str] = None,
    location: Optional[str] = None,
) -> str:
    """Search for matching issues in the database using category, severity, and location."""
    try:
        params = {}
        if category:
            params["category"] = category
        if severity:
            params["severity"] = severity

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{MONGO_API_URL}/issues",
                params=params,
                timeout=10.0,
            )
            if response.status_code == 200:
                issues = response.json()
                summary_lines = []
                for i, issue in enumerate(issues[:5], 1):
                    sev_icon = {"critical": "🔴", "high": "🟡", "medium": "🔵", "low": "🟢"}.get(
                        issue.get("severity", "medium"), "⚪"
                    )
                    summary_lines.append(
                        f"{i}. {sev_icon} **{issue.get('severity', 'unknown').title()}** — "
                        f"{issue.get('title', 'Untitled')} "
                        f"({issue.get('status', 'unknown')})"
                    )
                return "\n".join(summary_lines) if summary_lines else "No issues found."
            else:
                return f"Error querying database: {response.status_code} {response.text}"
    except Exception as e:
        return f"Database connection error: {str(e)}"


@tool
async def verify_resolution(issue_id: Optional[str] = None) -> str:
    """Verify issue resolution using the ML microservice. Tells the user to upload a verification image."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{ML_SERVICE_URL}/health", timeout=5.0)
            if response.status_code == 200:
                return "ML verification service is online. Tell the user to upload before/after images to complete verification."
            else:
                return f"ML verification service error: {response.status_code} {response.text}"
    except Exception as e:
        return f"ML service connection error: {str(e)}"
