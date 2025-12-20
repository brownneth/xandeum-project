from pydantic import BaseModel
from typing import Optional

class NodeStatsResponse(BaseModel):
    """Schema for the API response."""
    ip_address: str
    version: str
    status: str
    node_type: str 
    storage_used_bytes: int
    storage_committed_bytes: int
    formatted_usage: str
    last_seen: str

    cpu_percent: float = 0.0
    ram_used_bytes: int = 0
    ram_total_bytes: int = 0 
    
    rpc_port: int = 6000      
    packets_sent: int = 0     
    packets_received: int = 0 
 
    lat: Optional[float] = None
    lon: Optional[float] = None
    country: Optional[str] = None
    city: Optional[str] = None
    uptime_seconds: int = 0

class NetworkStatsResponse(BaseModel):

    total_nodes: int
    online_nodes: int
    total_storage_bytes: int