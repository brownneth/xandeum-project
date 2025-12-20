from fastapi import FastAPI, Query
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
    t = threading.Thread(target=start_monitor, daemon=True)
    t.start()
    yield
    print("Shutting down...")

app = FastAPI(title="Xandeum Network Monitor", version="1.0.0", lifespan=lifespan)

@app.get("/")
def health_check(): return {"status": "online"}

@app.get("/stats", response_model=NetworkStatsResponse)
def get_network_stats():

    conn = get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute('SELECT COUNT(DISTINCT ip_address) FROM node_stats')
        total = cur.fetchone()[0] or 0
        cur.execute("SELECT COUNT(DISTINCT ip_address) FROM node_stats WHERE timestamp > NOW() - INTERVAL '15 minutes'")
        online = cur.fetchone()[0] or 0
        cur.execute('SELECT SUM(storage_committed_bytes) FROM (SELECT DISTINCT ON (ip_address) storage_committed_bytes FROM node_stats ORDER BY ip_address, id DESC) as l')
        storage = cur.fetchone()[0] or 0
        return {"total_nodes": total, "online_nodes": online, "total_storage_bytes": int(storage)}
    except: return {"total_nodes": 0, "online_nodes": 0, "total_storage_bytes": 0}
    finally: conn.close()

@app.get("/nodes", response_model=List[NodeStatsResponse])
def get_nodes(page: int = 1, limit: int = 50, search: Optional[str] = None):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    offset = (page - 1) * limit

    try:
        query = "SELECT DISTINCT ON (ip_address) * FROM node_stats"
        params = []

        if search:
            query += " WHERE ip_address LIKE %s"
            params.append(f"%{search}%")

        query += " ORDER BY ip_address, id DESC LIMIT %s OFFSET %s"
        params.extend([limit, offset])
        cur.execute(query, tuple(params))
        rows = cur.fetchall()
    except: return []
    finally: conn.close()

    res = []
    for r in rows:
        is_public = bool(r['is_public']) or bool(r['rpc_active'])
        res.append({
            "ip_address": r['ip_address'], "version": r['version'], "status": r['status'],
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
            
            "lat": r.get('lat'), "lon": r.get('lon'), "country": r.get('country'), "city": r.get('city'),
            
            "uptime_seconds": r.get('uptime_seconds', 0)
        })
    return res

@app.get("/history")
def get_history():
    conn = get_db_connection()
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute('SELECT timestamp, total_nodes, total_storage_committed FROM network_snapshots ORDER BY timestamp ASC LIMIT 720')
        return cur.fetchall()
    finally: conn.close()