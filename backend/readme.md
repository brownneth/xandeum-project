# Xandeum Network Backend

## Overview
This repository contains the backend architecture for a Xandeum Network analytics system. The system provides a Data Availability Layer verification mechanism by ingesting, normalizing, and persisting pNode metrics (storage, uptime, versioning) in real-time.

The architecture decouples data ingestion from data retrieval, utilizing a high-availability cloud PostgreSQL database as the single source of truth.

## System Architecture

### 1. Ingestion Service (`app.monitor`)
A standalone Python process that performs O(1) network discovery.
* **Discovery Protocol:** Queries a designated seed node via the `get-pods-with-stats` RPC method to retrieve the complete network topology.
* **Data Normalization:** Sanitizes heterogeneous data structures (Maps/Lists) returned by different pNode versions.
* **Persistence:** Writes structured telemetry to the PostgreSQL cluster.
* **Fault Tolerance:** Implements graceful degradation for legacy nodes (v0.6.0) that do not support modern RPC methods.

### 2. Storage Layer (PostgreSQL)
Managed cloud database (Neon) storing time-series telemetry data.
* **Schema:** Relational schema optimized for time-series querying.
* **Indexing:** Indexed by `ip_address` to optimize read performance for high-frequency API polling.

### 3. API Gateway (`app.server`)
A FastAPI implementation serving normalized JSON data.
* **Pagination:** Implements cursor-like pagination via `limit` and `offset` parameters to support high-volume clients.
* **Type Safety:** Enforces strict schema validation using Pydantic models.
* **CORS:** Configured for unrestricted access (for development/hackathon purposes).

## Prerequisites
* Python 3.9+
* Network access to Xandeum pNodes (Port 6000)
* PostgreSQL Connection String (configured in `app/config.py`)

## Installation

1.  Initialize the virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # Windows: venv\Scripts\activate
    ```

2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

## Usage

### Starting the Ingestion Service
This service must be running to update the database with real-time metrics.
```bash
python -m app.monitor
````

### Starting the API Server

Starts the REST API on port 8000.

```bash
uvicorn app.server:app --reload
```

## API Specification

**GET /nodes**
Returns a paginated list of active pNodes and their utilization metrics.

  * **Parameters:**

      * `page` (int): Page number (default: 1)
      * `limit` (int): Records per page (default: 50, max: 100)

  * **Response Schema:**

    ```json
    [
      {
        "ip_address": "192.190.136.36",
        "version": "0.7.3",
        "status": "ONLINE",
        "storage_used_bytes": 94633,
        "storage_committed_bytes": 10737418240,
        "formatted_usage": "92.42 KB",
        "last_seen": "2025-12-10 03:00:00"
      }
    ]
    ```

<!-- end list -->

```