import psycopg2
from psycopg2.extras import RealDictCursor
from .config import DATABASE_URL
import logging

logger = logging.getLogger(__name__)

def get_db_connection():
    
    try:
        return psycopg2.connect(DATABASE_URL)
    except Exception as e:
        logger.error(f"Cloud Database Connection Failed: {e}")
        raise e

def init_db():

    conn = get_db_connection()
    conn.autocommit = True
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS node_stats (
            id SERIAL PRIMARY KEY,
            timestamp TIMESTAMP NOT NULL,
            pubkey TEXT,
            ip_address TEXT,
            version TEXT,
            status TEXT,
            storage_committed_bytes BIGINT,
            storage_used_bytes BIGINT,
            storage_percent REAL,
            uptime BIGINT,                 
            last_seen_timestamp BIGINT,
                   
            is_public BOOLEAN DEFAULT FALSE,
            rpc_active BOOLEAN DEFAULT FALSE,
            cpu_percent REAL DEFAULT 0,
            ram_used_bytes BIGINT DEFAULT 0
        )
    ''')

    cursor.execute("""
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='node_stats' AND column_name='lat') THEN
            ALTER TABLE node_stats ADD COLUMN lat REAL;
            ALTER TABLE node_stats ADD COLUMN lon REAL;
            ALTER TABLE node_stats ADD COLUMN country TEXT;
            ALTER TABLE node_stats ADD COLUMN city TEXT;
        END IF;
    END
    $$;
    """)

    cursor.execute("""
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='node_stats' AND column_name='rpc_port') THEN
            ALTER TABLE node_stats ADD COLUMN rpc_port INTEGER DEFAULT 6000;
            ALTER TABLE node_stats ADD COLUMN packets_sent BIGINT DEFAULT 0;
            ALTER TABLE node_stats ADD COLUMN packets_received BIGINT DEFAULT 0;
            ALTER TABLE node_stats ADD COLUMN ram_total_bytes BIGINT DEFAULT 0;
            -- Legacy/Optional placeholders
            ALTER TABLE node_stats ADD COLUMN rewards_sol REAL DEFAULT 0;
            ALTER TABLE node_stats ADD COLUMN uptime_seconds BIGINT DEFAULT 0;
        END IF;
    END
    $$;
    """)
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS network_snapshots (
            id SERIAL PRIMARY KEY,
            timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
            total_nodes INTEGER,
            online_nodes INTEGER,
            total_storage_committed BIGINT,
            total_storage_used BIGINT
        )
    ''')
    
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_ip_address ON node_stats(ip_address);')
    cursor.close()
    conn.close()
    logger.info("Database Schema Initialized & Migrated.")