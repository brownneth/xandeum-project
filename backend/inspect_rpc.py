# Dev tool to inspect RPC methods and discover new data fields.
import requests
import json
import os
from app.config import SEED_IPS, RPC_PORT

METHODS_TO_PROBE = [
    "get-version",         
    "get-stats",           
    "get-pods",           
    "get-pods-with-stats"  
]

def call_rpc(method, ip):
    """Generic function to call any RPC method."""
    url = f"http://{ip}:{RPC_PORT}/rpc"
    payload = {"jsonrpc": "2.0", "method": method, "id": 1}
    
    try:
        resp = requests.post(url, json=payload, timeout=5)
        if resp.status_code == 200:
            return resp.json(), True
        return {"error": f"Status {resp.status_code}", "body": resp.text}, False
    except Exception as e:
        return {"error": str(e)}, False

def inspect_network():
    """
    Probes multiple RPC methods to discover all available data fields.
    Saves each response to a separate JSON file for analysis.
    """
    if not SEED_IPS:
        print("No SEED_IPS configured in app/config.py")
        return

    target_ip = SEED_IPS[0]
    print(f"Inspecting Network Node: {target_ip}...\n")
    
    results = {}

    for method in METHODS_TO_PROBE:
        print(f"Probing method: '{method}'...", end=" ")
        data, success = call_rpc(method, target_ip)
        
        if success and "result" in data:
            print("SUCCESS")
            
            filename = f"rpc_dump_{method}.json"
            with open(filename, "w") as f:
                json.dump(data, f, indent=2)
                
            results[method] = "Captured"
        else:
            print("FAILED")
            results[method] = "Failed/Empty"

    print("\n INSPECTION SUMMARY")
    for method, status in results.items():
        print(f"• {method.ljust(20)} : {status}")
        
    print("\n  Done. Check the 'rpc_dump_*.json' files to see the new data fields available!")

if __name__ == "__main__":
    inspect_network()