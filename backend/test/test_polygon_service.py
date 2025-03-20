"""
Simple test for the Polygon service.
"""
import asyncio
import json
from backend.app.services.stock_service import polygon_service

async def test_polygon_service():
    """Test the Polygon service by fetching OHLC data for AAPL stock."""
    print("Testing Polygon service...")
    
    # Use the example data from the original request
    result = await polygon_service.get_stock_bars(
        ticker="AAPL",
        multiplier=1,
        timespan="day",
        from_date="2025-03-12",
        to_date="2025-03-19",
        adjusted=True,
        sort="asc",
        limit=120
    )
    
    # Print the result in a readable format
    print(f"API Response Status: {'Success' if 'results' in result else 'Error'}")
    print(json.dumps(result, indent=2))
    
    return result

if __name__ == "__main__":
    # Run the test
    asyncio.run(test_polygon_service()) 