import pandas as pd
from typing import Dict, Optional
import logging

class UserService:
    def __init__(self, client_data_service):
        self.client_data_service = client_data_service
        self.user_cache = {}  # In-memory cache for user data
        
    def authenticate_user(self, user_id: str) -> bool:
        """Verify if a user ID exists in the database."""
        try:
            # Check if the ID exists in the database
            return self.client_data_service.client_exists(user_id)
        except Exception as e:
            logging.error(f"Authentication error: {str(e)}")
            return False
            
    def get_user_data(self, user_id: str) -> Optional[Dict]:
        """Retrieve user data and cache it."""
        # Check cache first
        if user_id in self.user_cache:
            print(f"\n[CACHE HIT] User data retrieved from cache for ID: {user_id}")
            return self.user_cache[user_id]
            
        # Get data from database
        try:
            user_data = self.client_data_service.get_client_data(user_id)
            if user_data is not None:
                # Print statements for debugging
                print(f"\n{'='*60}")
                print(f"CACHING USER DATA - ID: {user_id}")
                print(f"{'='*60}")
                
                # Print key client features
                important_features = [
                    'ID', 'GPI_AGE', 'GPI_CLS_CODE_PT_OCCUP', 'GPI_CLS_PT_EDU_DESC',
                    'GPI_COUNTY_NAME', 'GPI_CUSTOMER_TYPE_DESC', 'CLIENT_TENURE',
                    'CEC_TOTAL_BALANCE_AMT', 'DEP_TOTAL_BALANCE_AMT', 'CRT_TOTAL_BALANCE_AMT'
                ]
                
                print("KEY FEATURES:")
                for feature in important_features:
                    if feature in user_data:
                        print(f"  {feature}: {user_data[feature]}")
                
                print(f"\nALL FEATURES ({len(user_data)} total):")
                for key, value in user_data.items():
                    print(f"  {key}: {value}")
                
                print(f"{'='*60}")
                print(f"Data successfully cached for user: {user_id}")
                print(f"{'='*60}\n")
                
                # Cache the data
                self.user_cache[user_id] = user_data
                return user_data
            return None
        except Exception as e:
            logging.error(f"Error retrieving user data: {str(e)}")
            return None
            
    def clear_cache(self, user_id: str = None):
        """Clear cache for specific user or all users."""
        if user_id:
            if user_id in self.user_cache:
                del self.user_cache[user_id]
                print(f"Cache cleared for user: {user_id}")
        else:
            self.user_cache.clear()
            print("All user cache cleared")
            
    def get_cached_user_count(self) -> int:
        """Get the number of users currently cached."""
        return len(self.user_cache)
        
    def get_cached_user_ids(self) -> list:
        """Get list of user IDs currently in cache."""
        return list(self.user_cache.keys())