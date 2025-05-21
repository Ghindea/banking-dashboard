import os
import pandas as pd
import logging
from flask import jsonify, request
from typing import Dict, List, Optional, Union

class ClientDataService:
    """Service to handle operations related to client data from CSV."""
    
    def __init__(self, data_path: str):
        self.data_path = data_path
        self.df = None
        self.load_data()
        
    def load_data(self) -> None:
        """Load client data from CSV file."""
        try:
            # Check if file exists
            if not os.path.exists(self.data_path):
                logging.error(f"Data file not found: {self.data_path}")
                raise FileNotFoundError(f"Data file not found: {self.data_path}")
            
            # Load CSV with proper data types
            self.df = pd.read_csv(self.data_path)
            
            # Convert ID to string to ensure consistent handling
            if 'ID' in self.df.columns:
                self.df['ID'] = self.df['ID'].astype(str)
            
            logging.info(f"Successfully loaded client data. Records: {len(self.df)}")
        except Exception as e:
            logging.error(f"Error loading client data: {str(e)}")
            raise
    
    def refresh_data(self) -> None:
        """Reload client data from CSV file."""
        self.load_data()
    
    def get_client_by_id(self, client_id: str) -> Optional[Dict]:
        """Get a single client by ID."""
        if self.df is None:
            logging.error("Data not loaded.")
            return None
        
        # Convert to string to ensure matching
        client_id = str(client_id)
        
        # Filter by ID
        client_data = self.df[self.df['ID'] == client_id]
        
        if client_data.empty:
            return None
        
        # Convert to dictionary and return first match
        return client_data.iloc[0].to_dict()
    
    def search_clients(self, query_params: Dict) -> List[Dict]:
        """Search clients by provided parameters."""
        if self.df is None:
            logging.error("Data not loaded.")
            return []
        
        # Start with a copy of all data
        filtered_df = self.df.copy()
        
        # Apply filters based on query parameters
        for key, value in query_params.items():
            if key in filtered_df.columns:
                # Handle different data types appropriately
                if isinstance(value, list):
                    filtered_df = filtered_df[filtered_df[key].isin(value)]
                else:
                    filtered_df = filtered_df[filtered_df[key] == value]
        
        # Convert to list of dictionaries
        result = filtered_df.to_dict(orient='records')
        return result
    
    def get_client_segments(self) -> Dict[str, int]:
        """Get client segments counts."""
        if self.df is None or 'GPI_CUSTOMER_TYPE_DESC' not in self.df.columns:
            return {}
        
        segments = self.df['GPI_CUSTOMER_TYPE_DESC'].value_counts().to_dict()
        return segments
    
    def get_average_balances(self) -> Dict[str, float]:
        """Get average balances for different account types."""
        if self.df is None:
            return {}
        
        balance_columns = [col for col in self.df.columns if 'AVG_BALANCE_AMT' in col]
        result = {}
        
        for col in balance_columns:
            account_type = col.replace('_AVG_BALANCE_AMT', '')
            avg_balance = self.df[col].mean()
            result[account_type] = round(avg_balance, 2)
        
        return result
    
    def get_transaction_statistics(self) -> Dict[str, Dict]:
        """Get transaction statistics by type."""
        if self.df is None:
            return {}
        
        # Transaction count columns
        trx_count_cols = [col for col in self.df.columns if 'TRX_' in col and '_CNT' in col]
        
        # Transaction amount columns
        trx_amt_cols = [col for col in self.df.columns if 'TRX_' in col and '_AMT' in col]
        
        result = {
            'counts': {},
            'amounts': {}
        }
        
        # Calculate averages for counts
        for col in trx_count_cols:
            trx_type = col.replace('TRX_', '').replace('_CNT', '')
            avg_count = self.df[col].mean()
            result['counts'][trx_type] = round(avg_count, 2)
        
        # Calculate averages for amounts
        for col in trx_amt_cols:
            trx_type = col.replace('TRX_', '').replace('_AMT', '')
            avg_amount = self.df[col].mean()
            result['amounts'][trx_type] = round(avg_amount, 2)
        
        return result
    
    def analyze_spending_patterns(self) -> Dict[str, float]:
        """Analyze spending patterns by MCC categories."""
        if self.df is None:
            return {}
        
        # Find MCC amount columns
        mcc_amt_cols = [col for col in self.df.columns if 'MCC_' in col and '_AMT' in col]
        
        result = {}
        
        # Calculate total spending by category
        for col in mcc_amt_cols:
            category = col.replace('MCC_', '').replace('_AMT', '')
            total_amount = self.df[col].sum()
            result[category] = round(total_amount, 2)
        
        return result
    
    def get_digital_engagement_stats(self) -> Dict[str, Union[float, Dict]]:
        """Get digital engagement statistics."""
        if self.df is None:
            return {}
        
        result = {}
        
        # Digital flags
        digital_flags = ['PTS_IB_FLAG', 'APPLE_PAY_FLAG', 'GEORGE_PAY_FLAG', 
                          'GOOGLE_PAY_FLAG', 'WALLET_FLAG', 'GEORGE_INFO_FLAG']
        
        # Calculate percentages of clients using each digital service
        for flag in digital_flags:
            if flag in self.df.columns:
                pct = (self.df[flag].sum() / len(self.df)) * 100
                result[flag.replace('_FLAG', '')] = round(pct, 2)
        
        # Get average IB logins if available
        if 'CHNL_IB_LOGINS_CNT' in self.df.columns:
            result['AVG_IB_LOGINS'] = round(self.df['CHNL_IB_LOGINS_CNT'].mean(), 2)
        
        return result