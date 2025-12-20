from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware  
from typing import List, Optional
from psycopg2.extras import RealDictCursor
from contextlib import asynccontextmanager

import threading

from .database import get_db_connection
from .utils import format_bytes
from .models import NodeStatsResponse, NetworkStatsResponse
from .monitor import start_monitor


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("API Starting... launching Background Monitor...")
    t = threading.Thread(target=start_monitor, daemon=True)
    t.start()
    yield
    print("API Shutting down...")

app = FastAPI(
    title="Xandeum Network Monitor",
    description="Real-time analytics for the Xandeum pNode Network",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",                 
        "https://xplorer-ten.vercel.app",       
        "https://xplorer-ten.vercel.app/"        
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Health"])
def health_check():
    return {"status": "online", "service": "Xandeum API"}

@app.get("/stats", response_model=NetworkStatsResponse, tags=["Stats"])
def get_network_stats():
    
    conn = get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute('SELECT COUNT(DISTINCT ip_address) FROM node_stats')
        total = cur.fetchone()[0] or 0
        
        cur.execute("SELECT COUNT(DISTINCT ip_address) FROM node_stats WHERE timestamp > NOW() - INTERVAL '15 minutes'")
        online = cur.fetchone()[0] or 0
        
        cur.execute('''
            SELECT SUM(storage_committed_bytes) 
            FROM (
                SELECT DISTINCT ON (ip_address) storage_committed_bytes 
                FROM node_stats 
                ORDER BY ip_address, id DESC
            ) as latest_rows
        ''')
        storage = cur.fetchone()[0] or 0
        
        return {
            "total_nodes": total, 
            "online_nodes": online, 
            "total_storage_bytes": int(storage)
        }
    except Exception as e:
        print(f"STATS ERROR: {e}")
        return {"total_nodes": 0, "online_nodes": 0, "total_storage_bytes": 0}
    finally:
        conn.close()

@app.get("/nodes", response_model=List[NodeStatsResponse], tags=["Nodes"])
def get_nodes(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = Query(None, description="Search by IP address")
):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    offset = (page - 1) * limit

    try:
        query = "SELECT DISTINCT ON (ip_address) * FROM node_stats"
        params = []

        if search:
            query += " WHERE ip_address LIKE %s"
            params.append(f"%{search}%")
        
        query += " ORDER BY ip_address, id DESC LIMIT %s OFFSET %s"
        params.extend([limit, offset])

        cursor.execute(query, tuple(params))
        rows = cursor.fetchall()
    except Exception as e:
        print(f"ERROR: {e}")
        return []
    finally:
        conn.close()

    results = []
    for r in rows:
        is_public = bool(r['is_public']) or bool(r['rpc_active'])
        
        results.append({
            "ip_address": r['ip_address'] or "Unknown",
            "version": r['version'] or "unknown",
            "status": r['status'] or "OFFLINE",
            "node_type": "Public Node" if is_public else "Private Node",
            "storage_used_bytes": r['storage_used_bytes'] or 0,
            "storage_committed_bytes": r['storage_committed_bytes'] or 0,
            "formatted_usage": format_bytes(r['storage_used_bytes']),
            "last_seen": str(r['timestamp']),

            "cpu_percent": r['cpu_percent'] or 0.0,
            "ram_used_bytes": r['ram_used_bytes'] or 0,
            "ram_total_bytes": r.get('ram_total_bytes', 0),

            "rpc_port": r.get('rpc_port', 6000),
            "packets_sent": r.get('packets_sent', 0),
            "packets_received": r.get('packets_received', 0),
            "lat": r.get('lat'),
            "lon": r.get('lon'),
            "country": r.get('country'),
            "city": r.get('city'),
            "uptime_seconds": r.get('uptime_seconds', 0)
        })
    
    return results

@app.get("/history", tags=["Stats"])
def get_network_history():
    conn = get_db_connection()
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute('''
            SELECT timestamp, total_nodes, total_storage_committed 
            FROM network_snapshots 
            ORDER BY timestamp ASC 
            LIMIT 720
        ''')
        return cursor.fetchall()
    except Exception:
        return []
    finally:
        conn.close()