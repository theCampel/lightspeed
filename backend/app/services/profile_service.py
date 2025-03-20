import json
import os
from pathlib import Path
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

class ProfileService:
    def __init__(self):
        """Initialize the Polygon.io service."""
        pass

    def load_profile(self, url= "backend/app/database/profiles.json"):
        """Load the profile from the Path."""
        try:
            with open(url, 'r') as file:
                profiles = json.load(file)
                return profiles
        except FileNotFoundError:
            logger.error(f"Profile file not found: {url}")
            return []
        except json.JSONDecodeError:
            logger.error(f"Invalid JSON format in profile file: {url}")
            return []
        except Exception as e:
            logger.error(f"Error loading profile from {url}: {str(e)}")
            return []

    def get_profile_by_name(self, profiles, name: str):
        """
        Return a profile for a given name.
        
        Args:
            profiles: List of profiles
            name: Name to search for
            
        Returns:
            Profile dictionary or None if not found
        """
        if not profiles:
            return None
            
        for profile_entry in profiles:
            if profile_entry.get("profile", {}).get("name") == name:
                return profile_entry
                
        return None
    
    def get_investment_goals(self, profile: Dict[str, Any]) -> List[Dict[str, str]]:
        """
        Extract investment goals from a profile.
        
        Args:
            profile: Profile dictionary
            
        Returns:
            List of investment goals with title and value
        """
        if not profile or "profile" not in profile:
            return []
            
        return profile.get("profile", {}).get("investmentGoals", [])
        
        