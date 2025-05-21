import sqlite3
import pandas as pd

df = pd.read_csv("data/sample_clients.csv")

connection = sqlite3.connect("database.db")

df.to_sql("data", connection, if_exists="replace", index=False)

connection.close()


