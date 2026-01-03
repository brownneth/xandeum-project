import os
import time
import psycopg2
from psycopg2.extras import RealDictCursor


DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    while True:
        try:
            conn = psycopg2.connect(DATABASE_URL)
            return conn
        except psycopg2.OperationalError:
            print("Database not ready... retrying in 2s")
            time.sleep(2)

def init_db():

    conn = get_db_connection()
    try:
        cur = conn.cursor()
        
        cur.execute('''
            CREATE TABLE IF NOT EXISTS geo_state (
                clean_ip TEXT PRIMARY KEY,
                lat FLOAT,
                lon FLOAT,
                country TEXT,
                city TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        cur.execute('''
            CREATE TABLE IF NOT EXISTS node_stats (
                id SERIAL PRIMARY KEY,
                timestamp TIMESTAMP,
                pubkey TEXT,
                ip_address TEXT,
                clean_ip TEXT,
                version TEXT,
                status TEXT,
                storage_committed_bytes BIGINT,
                storage_used_bytes BIGINT,
                storage_percent FLOAT,
                uptime FLOAT,
                last_seen_timestamp BIGINT,
                is_public BOOLEAN DEFAULT FALSE,
                rpc_active BOOLEAN DEFAULT FALSE,
                cpu_percent FLOAT DEFAULT 0,
                ram_used_bytes BIGINT DEFAULT 0,
                ram_total_bytes BIGINT DEFAULT 0,
                packets_sent BIGINT DEFAULT 0,
                packets_received BIGINT DEFAULT 0,
                rpc_port INTEGER DEFAULT 6000,
                uptime_seconds FLOAT DEFAULT 0
            )
        ''')
        
        cur.execute("CREATE INDEX IF NOT EXISTS idx_clean_ip ON node_stats (clean_ip);")
        cur.execute("CREATE INDEX IF NOT EXISTS idx_ip_timestamp ON node_stats (ip_address, timestamp DESC);")

        cur.execute('''
            CREATE TABLE IF NOT EXISTS network_snapshots (
                id SERIAL PRIMARY KEY,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                total_nodes INTEGER,
                online_nodes INTEGER,
                total_storage_committed BIGINT
            )
        ''')

        
        conn.commit()
        print("System Foundation Initialized.")
    except Exception as e:
        print(f"Init DB Error: {e}")
    finally:
        conn.close()