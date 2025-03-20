# Query the graph
from backend.app import six_api


response = six_api.query_graph("get me the prices of Tesla since 2020")
print(response)

# Search with multiple criteria
criteria = {"ebitda": "is positive", "employees": "more than 5000"}
response = six_api.search_with_criteria(criteria)
print(response)

# Get OHLCV data
response = six_api.get_ohlcv_data("Apple Inc.", first="01.01.2023", last="01.01.2024")
print(response)

# Get company data
query_data = {"Google": "number of employees|2023", "Amazon": "market cap|2023"}
response = six_api.company_data_search(query_data)
print(response)

# Get company summary
response = six_api.get_summary("Microsoft")
print(response)

# Query LLM
response = six_api.ask_llm("What is the stock price trend of Nvidia?")
print(response)

# Restart agent (with password)
response = six_api.restart_agent("mypassword123")
print(response)

# Check agent health
response = six_api.check_health()
print(response)
