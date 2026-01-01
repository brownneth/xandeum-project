import psycopg2

DB_URL = "postgresql://neondb_owner:npg_ru6OEQjSMR4H@ep-aged-credit-ag03cwyn-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

try:
    conn = psycopg2.connect(DB_URL)
    conn.autocommit = True
    cur = conn.cursor()
    
    print("🗑️  Dropping old tables...")
    cur.execute("DROP TABLE IF EXISTS node_stats;")
    cur.execute("DROP TABLE IF EXISTS network_snapshots;")
    
    print("✅ Tables deleted. The next Deploy will recreate them with the NEW structure.")
    conn.close()
    
except Exception as e:
    print(f"❌ Error: {e}")