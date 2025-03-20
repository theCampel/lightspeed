import json
import os
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

class BucketsService:
    def __init__(self):
        """Initialize the BucketsService."""
        pass

    def get_buckets(self, url= "backend/app/database/buckets.json"):
        """Get the buckets from the Path."""
        try:
            with open(url, 'r') as file:
                buckets = json.load(file)
                return buckets
        except FileNotFoundError:
            logger.error(f"Buckets file not found: {url}")
            return []

    def get_bucket_by_id(self, id: str):
        """Get the bucket by id."""
        buckets = self.get_buckets()
        for bucket in buckets:
            if bucket['id'] == id:
                return bucket
        return None
