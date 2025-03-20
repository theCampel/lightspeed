"""
Service to handle API key cycling for rate-limited APIs.
"""
from typing import List, Optional
import time
from datetime import datetime, timedelta
from app.services.config import POLYGON_API_KEYS, POLYGON_REQUESTS_PER_MINUTE

class KeyCyclingService:
    def __init__(self, api_keys: List[str], requests_per_minute: int):
        """
        Initialize the key cycling service.
        
        Args:
            api_keys: List of API keys to cycle through
            requests_per_minute: Maximum number of requests allowed per minute per key
        """
        self.api_keys = api_keys
        self.requests_per_minute = requests_per_minute
        self.current_key_index = 0
        self.request_timestamps = {i: [] for i in range(len(api_keys))}
        
    def get_api_key(self) -> Optional[str]:
        """
        Get the next available API key.
        
        Returns:
            An API key that has not reached its rate limit, or None if all keys are rate-limited
        """
        # Check all keys (maximum one full cycle)
        for _ in range(len(self.api_keys)):
            key_index = self.current_key_index
            key = self.api_keys[key_index]
            
            # Clean up old timestamps
            current_time = datetime.now()
            minute_ago = current_time - timedelta(minutes=1)
            self.request_timestamps[key_index] = [
                ts for ts in self.request_timestamps[key_index] 
                if ts > minute_ago
            ]
            
            # If this key has not reached its limit
            if len(self.request_timestamps[key_index]) < self.requests_per_minute:
                # Record this request
                self.request_timestamps[key_index].append(current_time)
                # Move to next key for future requests
                self.current_key_index = (key_index + 1) % len(self.api_keys)
                return key
                
            # Try next key
            self.current_key_index = (key_index + 1) % len(self.api_keys)
        
        # If we've checked all keys and none are available
        return None

# Create singleton instance for Polygon API
polygon_key_service = KeyCyclingService(POLYGON_API_KEYS, POLYGON_REQUESTS_PER_MINUTE) 