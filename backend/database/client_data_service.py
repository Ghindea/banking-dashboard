import os
import logging
import sqlite3
from typing import Dict, List, Optional, Union
import pandas as pd

class ClientDataService:
    """Service to handle operations related to client data from SQLite database."""

    def __init__(self, db_path: str):
        self.db_path = db_path

    def _connect(self):
        return sqlite3.connect(self.db_path)

    def client_exists(self, client_id: str) -> bool:
        with self._connect() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT 1 FROM clients WHERE ID = ?", (client_id,))
            return cursor.fetchone() is not None

    def get_client_data(self, client_id: str) -> Optional[Dict]:
        with self._connect() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM clients WHERE ID = ?", (client_id,))
            row = cursor.fetchone()
            if row:
                columns = [desc[0] for desc in cursor.description]
                return dict(zip(columns, row))
            return None

    def get_client_by_id(self, client_id: str) -> Optional[Dict]:
        return self.get_client_data(client_id)

    def search_clients(self, query_params: Dict) -> List[Dict]:
        query = "SELECT * FROM clients WHERE 1=1"
        params = []
        for key, value in query_params.items():
            if isinstance(value, list):
                placeholders = ','.join('?' for _ in value)
                query += f" AND {key} IN ({placeholders})"
                params.extend(value)
            else:
                query += f" AND {key} = ?"
                params.append(value)

        with self._connect() as conn:
            cursor = conn.cursor()
            cursor.execute(query, tuple(params))
            rows = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]
            return [dict(zip(columns, row)) for row in rows]

    def get_client_segments(self) -> Dict[str, int]:
        query = "SELECT GPI_CUSTOMER_TYPE_DESC, COUNT(*) FROM clients GROUP BY GPI_CUSTOMER_TYPE_DESC"
        with self._connect() as conn:
            cursor = conn.cursor()
            cursor.execute(query)
            return {row[0]: row[1] for row in cursor.fetchall()}

    def get_average_balances(self) -> Dict[str, float]:
        query = "PRAGMA table_info(clients)"
        with self._connect() as conn:
            cursor = conn.cursor()
            cursor.execute(query)
            columns = [row[1] for row in cursor.fetchall() if 'AVG_BALANCE_AMT' in row[1]]

            result = {}
            for col in columns:
                cursor.execute(f"SELECT AVG({col}) FROM clients")
                avg = cursor.fetchone()[0] or 0.0
                result[col.replace('_AVG_BALANCE_AMT', '')] = round(avg, 2)
            return result

    def get_transaction_statistics(self) -> Dict[str, Dict]:
        with self._connect() as conn:
            cursor = conn.cursor()
            cursor.execute("PRAGMA table_info(clients)")
            columns = [row[1] for row in cursor.fetchall()]

            result = {'counts': {}, 'amounts': {}}

            for col in columns:
                if 'TRX_' in col and '_CNT' in col:
                    trx_type = col.replace('TRX_', '').replace('_CNT', '')
                    cursor.execute(f"SELECT AVG({col}) FROM clients")
                    result['counts'][trx_type] = round(cursor.fetchone()[0] or 0.0, 2)
                elif 'TRX_' in col and '_AMT' in col:
                    trx_type = col.replace('TRX_', '').replace('_AMT', '')
                    cursor.execute(f"SELECT AVG({col}) FROM clients")
                    result['amounts'][trx_type] = round(cursor.fetchone()[0] or 0.0, 2)

            return result

    def analyze_spending_patterns(self) -> Dict[str, float]:
        with self._connect() as conn:
            cursor = conn.cursor()
            cursor.execute("PRAGMA table_info(clients)")
            columns = [row[1] for row in cursor.fetchall() if 'MCC_' in row[1] and '_AMT' in row[1]]

            result = {}
            for col in columns:
                cursor.execute(f"SELECT SUM({col}) FROM clients")
                result[col.replace('MCC_', '').replace('_AMT', '')] = round(cursor.fetchone()[0] or 0.0, 2)
            return result

    def get_digital_engagement_stats(self) -> Dict[str, Union[float, Dict]]:
        flags = ['PTS_IB_FLAG', 'APPLE_PAY_FLAG', 'GEORGE_PAY_FLAG', 'GOOGLE_PAY_FLAG', 'WALLET_FLAG', 'GEORGE_INFO_FLAG']
        result = {}

        with self._connect() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM clients")
            total_clients = cursor.fetchone()[0]

            for flag in flags:
                cursor.execute(f"SELECT SUM({flag}) FROM clients")
                count = cursor.fetchone()[0] or 0
                result[flag.replace('_FLAG', '')] = round((count / total_clients) * 100, 2)

            cursor.execute("SELECT AVG(CHNL_IB_LOGINS_CNT) FROM clients")
            result['AVG_IB_LOGINS'] = round(cursor.fetchone()[0] or 0.0, 2)

        return result

    def get_sample_client_ids(self, count: int = 10) -> List[str]:
        with self._connect() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT ID FROM clients LIMIT ?", (count,))
            return [row[0] for row in cursor.fetchall()]

    def get_offers_for_client(self, client_id: str) -> Dict:
        query = """
        SELECT DISTINCT * FROM offers
        WHERE (SEG_ID = 0 AND CLUS_ID = (SELECT DEM_SEG FROM clients WHERE ID = ?))
        OR (SEG_ID = 1 AND CLUS_ID = (SELECT FIN_SEG FROM clients WHERE ID = ?))
        OR (SEG_ID = 2 AND CLUS_ID = (SELECT TRANS_SEG FROM clients WHERE ID = ?))
        OR (SEG_ID = 3 AND CLUS_ID = (SELECT PROD_SEG FROM clients WHERE ID = ?))
        OR (SEG_ID = 4 AND CLUS_ID = (SELECT DIG_SEG FROM clients WHERE ID = ?))
        OR (SEG_ID = 5 AND CLUS_ID = (SELECT REL_SEG FROM clients WHERE ID = ?))
        """
        age_query = "SELECT GPI_AGE FROM clients WHERE ID = ? LIMIT 1;"
        
        mapper = {
            0: "DEM_SEG",
            1: "FIN_SEG",
            2: "TRANS_SEG",
            3: "PROD_SEG",
            4: "DIG_SEG",
            5: "REL_SEG",
        }

        with self._connect() as conn:
            cursor = conn.cursor()
            cursor.execute(age_query, (client_id,))
            result = cursor.fetchone()
            age = result[0] if result else None

            df = pd.read_sql_query(query, conn, params=(client_id,) * 6)
            df = df.drop_duplicates(subset=["ID"])

            if age is not None and age < 18:
                df = df[df['ELIG'].astype(str) == '0']
                
            df['SEG_ID'] = df['SEG_ID'].map(mapper)

            df = df.drop(columns=["ID", "CLUS_ID"], errors="ignore")
            return {
                "client_id": client_id,
                "offers": df.to_dict(orient="records")
            }

    def get_products_for_client(self, client_id: str) -> Dict:
        query = """
        SELECT DISTINCT * FROM products
        WHERE (SEG_ID = 0 AND CLUS_ID = (SELECT DEM_SEG FROM clients WHERE ID = ?))
        OR (SEG_ID = 1 AND CLUS_ID = (SELECT FIN_SEG FROM clients WHERE ID = ?))
        OR (SEG_ID = 2 AND CLUS_ID = (SELECT TRANS_SEG FROM clients WHERE ID = ?))
        OR (SEG_ID = 3 AND CLUS_ID = (SELECT PROD_SEG FROM clients WHERE ID = ?))
        OR (SEG_ID = 4 AND CLUS_ID = (SELECT DIG_SEG FROM clients WHERE ID = ?))
        OR (SEG_ID = 5 AND CLUS_ID = (SELECT REL_SEG FROM clients WHERE ID = ?))
        """
        age_query = "SELECT GPI_AGE FROM clients WHERE ID = ? LIMIT 1;"
        
        mapper = {
            0: "DEM_SEG",
            1: "FIN_SEG",
            2: "TRANS_SEG",
            3: "PROD_SEG",
            4: "DIG_SEG",
            5: "REL_SEG",
        }

        with self._connect() as conn:
            cursor = conn.cursor()
            cursor.execute(age_query, (client_id,))
            result = cursor.fetchone()
            age = result[0] if result else None

            df = pd.read_sql_query(query, conn, params=(client_id,) * 6)
            df = df.drop_duplicates(subset=["ID"])
            
            if age is not None and age < 18:
                df = df[df['ELIG'].astype(str) == '0']

            df['SEG_ID'] = df['SEG_ID'].map(mapper)

            df = df.drop(columns=["ID", "CLUS_ID"], errors="ignore")
            return {
                "client_id": client_id,
                "products": df.to_dict(orient="records")
            }
