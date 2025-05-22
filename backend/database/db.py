import pandas as pd
import sqlite3

df_clients = pd.read_csv("data/clustered_clients.csv")
df_all_offers = pd.read_csv("data/cluster_offers.csv")

df_products = df_all_offers[df_all_offers["ID"].str.startswith("P")].copy()
df_offers = df_all_offers[df_all_offers["ID"].str.startswith("O")].copy()

conn = sqlite3.connect("database.db")
cursor = conn.cursor()

df_clients.to_sql("clients", conn, if_exists="replace", index=False)

cursor.execute("DROP TABLE IF EXISTS products")
cursor.execute("""
CREATE TABLE products (
    ID TEXT,
    SEG_ID INTEGER,
    CLUS_ID INTEGER,
    PROD TEXT,
    ELIG TEXT,
    DESCR TEXT
)
""")
df_products.columns = ['ID', 'SEG_ID', 'CLUS_ID', 'PROD', 'ELIG', 'DESCR']
df_products.to_sql("products", conn, if_exists="append", index=False)

cursor.execute("DROP TABLE IF EXISTS offers")
cursor.execute("""
CREATE TABLE offers (
    ID TEXT,
    SEG_ID INTEGER,
    CLUS_ID INTEGER,
    PROD TEXT,
    ELIG TEXT,
    DESCR TEXT,
    LINK TEXT
)
""")
df_offers.columns = ['ID', 'SEG_ID', 'CLUS_ID', 'PROD', 'ELIG', 'DESCR', 'LINK']
df_offers.to_sql("offers", conn, if_exists="append", index=False)

conn.commit()
conn.close()

