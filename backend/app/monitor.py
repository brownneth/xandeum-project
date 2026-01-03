import requests
import time
import logging
import random
from datetime import datetime
from typing import List, Optional, Dict, Any
from concurrent.futures import ThreadPoolExecutor, as_completed

from .config import SEED_IPS, RPC_PORT, POLL_INTERVAL_SECONDS
from .database import init_db, get_db_connection

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)



def get_ip_location(ip_address: str) -> Dict[str, Any]:

    clean_ip = ip_address.split(':')[0]
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT lat, lon, country, city FROM geo_cache WHERE ip_address = %s", (clean_ip,))
        cached = cursor.fetchone()
        if cached and cached[0] is not None:
            conn.close()
            return {"lat": cached[0], "lon": cached[1], "country": cached[2], "city": cached[3]}
    except Exception as e:
        logger.error(f"Geo Cache Read Error: {e}")

    try:
        time.sleep(1.5) 
        
        resp = requests.get(f"http://ip-api.com/json/{clean_ip}", timeout=3)
        if resp.status_code == 200 and resp.json().get('status') == 'success':
            data = resp.json()
            geo = {
                "lat": data.get("lat"), 
                "lon": data.get("lon"), 
                "country": data.get("countryCode"), 
                "city": data.get("city")
            }
            
            try:
                cursor.execute("""
                    INSERT INTO geo_cache (ip_address, lat, lon, country, city)
                    VALUES (%s, %s, %s, %s, %s)
                    ON CONFLICT (ip_address) DO NOTHING
                """, (clean_ip, geo['lat'], geo['lon'], geo['country'], geo['city']))
                conn.commit()
            except Exception as db_err:
                logger.error(f"Geo Cache Write Error: {db_err}")
                
            conn.close()
            return geo
    except Exception as e:
        logger.warning(f"Geo API Limit or Error for {clean_ip}: {e}")
    
    conn.close()
    return {"lat": None, "lon": None, "country": None, "city": None}

def cleanup_old_data():

    conn = get_db_connection()
    conn.autocommit = True
    try:
        conn.cursor().execute("DELETE FROM node_stats WHERE timestamp < NOW() - INTERVAL '24 hours'")
        logger.info("Old data cleanup complete.")
    except Exception as e:
        logger.error(f"Cleanup failed: {e}")
    finally: conn.close()

def capture_snapshot():
    conn = get_db_connection()
    conn.autocommit = True
    try:
        cur = conn.cursor()

        cur.execute("""
            SELECT 
                COUNT(DISTINCT ip_address), 
                COUNT(DISTINCT CASE WHEN timestamp > NOW() - INTERVAL '15 minutes' THEN ip_address END), 
                (
                    SELECT SUM(storage_committed_bytes) 
                    FROM (
                        SELECT DISTINCT ON (ip_address) storage_committed_bytes 
                        FROM node_stats 
                        ORDER BY ip_address, id DESC
                    ) AS latest_storage
                )
            FROM node_stats
        """)
        
        r = cur.fetchone()
        total_storage = r[2] if r[2] is not None else 0
        
        cur.execute(
            "INSERT INTO network_snapshots (total_nodes, online_nodes, total_storage_committed) VALUES (%s, %s, %s)", 
            (r[0] or 0, r[1] or 0, total_storage)
        )
        logger.info(f"Snapshot Captured: {r[0]} nodes, {r[1]} online.")
    except Exception as e:
        logger.error(f"Snapshot failed: {e}")
    finally: conn.close()

def fetch_network_state(seed_ip: str):
    url = f"http://{seed_ip}:{RPC_PORT}/rpc"
    try:
        logger.info(f"Contacting Seed Node: {seed_ip}...")
        resp = requests.post(url, json={"jsonrpc": "2.0", "method": "get-pods-with-stats", "id": 1}, timeout=5)
        
        if resp.status_code == 200:
            data = resp.json()
            if "result" in data and "pods" in data["result"]:
                pods = data["result"]["pods"]
                logger.info(f"Received {len(pods)} pods from {seed_ip}")
                return pods
            else:
                logger.warning(f"Seed {seed_ip} replied, but no 'pods' in result.")
        else:
            logger.warning(f"Seed {seed_ip} returned status {resp.status_code}")
            
    except Exception as e:
        logger.error(f"Failed to fetch from seed {seed_ip}: {e}")
    return None

def probe_deep_stats(node: Dict[str, Any]):
    port = node.get('rpc_port', RPC_PORT)
    ip = node.get('address', '').split(':')[0]
    
    node.update({'rpc_active': False, 'cpu_percent': 0.0, 'ram_used_bytes': 0, 'ram_total_bytes': 0, 'packets_sent': 0, 'packets_received': 0})

    if not node.get('is_public', False) or not ip: return node


    try:

        resp = requests.post(f"http://{ip}:{port}/rpc", json={"jsonrpc": "2.0", "method": "get-stats", "id": 1}, timeout=2)
        if resp.status_code == 200:
            res = resp.json().get('result', {})
            if res:
                node['rpc_active'] = True
                node['cpu_percent'] = res.get('cpu_percent', 0.0)
                node['ram_used_bytes'] = res.get('ram_used', 0)
                node['ram_total_bytes'] = res.get('ram_total', 0)
                node['packets_sent'] = res.get('packets_sent', 0)
                node['packets_received'] = res.get('packets_received', 0)
    except Exception:
        pass
    return node

def save_batch(nodes: List[Dict[str, Any]]):
    processed = []
    with ThreadPoolExecutor(max_workers=5) as ex:
        futures = {ex.submit(probe_deep_stats, n): n for n in nodes}
        for f in as_completed(futures): processed.append(f.result())

    random.shuffle(processed)

    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    saved_count = 0
    for n in processed:
        get_ip_location(n.get('address', '0.0.0.0'))
        
        uptime = n.get('uptime', 0)
        try:
            cursor.execute('''
                INSERT INTO node_stats (
                    timestamp, pubkey, ip_address, version, status,
                    storage_committed_bytes, storage_used_bytes, storage_percent, 
                    uptime, last_seen_timestamp, is_public, rpc_active, 
                    cpu_percent, ram_used_bytes, 
                    lat, lon, country, city,
                    rpc_port, packets_sent, packets_received, ram_total_bytes, uptime_seconds
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 
                          NULL, NULL, NULL, NULL, 
                          %s, %s, %s, %s, %s)
            ''', (
                now, n.get('pubkey', 'UNKNOWN'), n.get('address', '0.0.0.0'),
                n.get('version', '0.0.0'), 'ONLINE', n.get('storage_committed', 0),
                n.get('storage_used', 0), n.get('storage_usage_percent', 0.0),
                uptime, n.get('last_seen_timestamp', 0),
                n.get('is_public', False), n.get('rpc_active', False),
                n.get('cpu_percent', 0.0), n.get('ram_used_bytes', 0),

                n.get('rpc_port', 6000), n.get('packets_sent', 0), n.get('packets_received', 0),
                n.get('ram_total_bytes', 0), uptime
            ))
            saved_count += 1
        except Exception as e:
            logger.error(f"DB INSERT ERROR: {e}")
    
    conn.commit()
    conn.close()
    logger.info(f"Batch Complete. Successfully Saved: {saved_count}/{len(processed)} nodes.")

def start_monitor():
    init_db() 
    cleanup_old_data()
    logger.info("Monitor Started")
    loops = 0
    snap_timer = 0
    
    while True:
        data_found = False
        logger.info("Starting Poll Cycle...")
        
        for seed in SEED_IPS:
            res = fetch_network_state(seed)
            if res:
                save_batch(res)
                data_found = True
                break 
        
        if not data_found:
            logger.error("CRITICAL: Attempted all Seed Nodes but found NO data.")

        loops += 1
        if loops >= 300:
            cleanup_old_data()
            loops = 0
            
        snap_timer += 1
        if snap_timer >= 60:
            capture_snapshot()
            snap_timer = 0
            
        time.sleep(POLL_INTERVAL_SECONDS)

if __name__ == "__main__":
    start_monitor()