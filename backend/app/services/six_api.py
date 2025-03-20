import requests
from typing import Optional

# Base API URL
BASE_URL = "https://idchat-api-containerapp01-dev.orangepebble-16234c4b.switzerlandnorth.azurecontainerapps.io"

def query_graph(query: str) -> dict:
    """
    Query the graph for information.
    
    :param query: Natural language query.
    :return: JSON response.
    """
    url = f"{BASE_URL}/query?query={query}"
    response = requests.post(url)
    return response.json()


def search_with_criteria(criteria: dict) -> dict:
    """
    Search companies that fulfill certain criteria.
    
    :param criteria: Dictionary of criteria, e.g. {"ebitda": "is positive", "employees": "more than 10000"}
    :return: JSON response.
    """
    url = f"{BASE_URL}/searchwithcriteria"
    response = requests.post(url, json=criteria)
    return response.json()


def get_ohlcv_data(query: str, first: str = "01.01.2024", last: Optional[str] = None) -> dict:
    """
    Retrieve historical OHLCV (Open, High, Low, Close, Volume) price data for a company.
    
    :param query: Company name.
    :param first: Start date (format: "dd.mm.yyyy").
    :param last: Optional end date (format: "dd.mm.yyyy").
    :return: JSON response.
    """
    url = f"{BASE_URL}/ohlcv?query={query}&first={first}"
    if last:
        url += f"&last={last}"
    response = requests.post(url)
    return response.json()


def company_data_search(query: dict) -> dict:
    """
    Retrieve company data based on a structured query.

    :param query: Dictionary containing company queries, e.g.
                  {"Caixabank": "number of employees|2023", "BBVA": "market cap|2023"}
    :return: JSON response.
    """
    url = f"{BASE_URL}/companydatasearch"
    response = requests.post(url, json=query)
    return response.json()


def get_summary(query: str) -> dict:
    """
    Get basic company information.

    :param query: Company name.
    :return: JSON response.
    """
    url = f"{BASE_URL}/summary?query={query}"
    response = requests.post(url)
    return response.json()


def ask_llm(query: str) -> dict:
    """
    Query the OpenAI GPT-4o model.

    :param query: Natural language query.
    :return: JSON response.
    """
    url = f"{BASE_URL}/llm?query={query}"
    response = requests.post(url)
    return response.json()


def restart_agent(request_password: str) -> dict:
    """
    Manually restart the agent with a password.
    
    :param request_password: The required password for restarting the agent.
    :return: JSON response.
    """
    url = f"{BASE_URL}/restart_agent?request={request_password}"
    response = requests.post(url)
    return response.json()


def check_health() -> dict:
    """
    Check the health status of the agent.

    :return: JSON response indicating service health.
    """
    url = f"{BASE_URL}/health"
    response = requests.get(url)
    return response.json()
