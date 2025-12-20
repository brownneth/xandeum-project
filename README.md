# XPLORER | Xandeum pNode Explorer and Analysis platform

![Version](https://img.shields.io/badge/version-1.0.0_beta-blue) ![Network](https://img.shields.io/badge/network-Xandeum_v0.8_Reinheim-5b21b6) ![License](https://img.shields.io/badge/license-MIT-green)

## System Overview

XPLORER is a telemetry and analytics dashboard designed for the **Xandeum Provider Node (pNode)** ecosystem. It provides a visual interface for monitoring the decentralized storage layer, specifically tracking nodes participating in the **South Era (v0.8 Reinheim)** network release.

The application aggregates real-time metrics from the pNode API, visualizing global distribution, storage capacity committed vs. used, and network latency.

## Technical Specifications

### Architecture
The application is built as a Single Page Application (SPA) using React 18, utilizing a client-side data layer to interface with the Xandeum RPC/Rest endpoints.

* **Frontend Framework**: React 18 (Vite)
* **Design System**: Carbon Design System (via Tailwind CSS)
* **Visualization Engine**: Recharts (Timeseries data), React Simple Maps (Geospatial data)
* **State Management**: React Context + Custom Hooks (`useNetworkData`)

### Supported Protocol
This dashboard is calibrated for **v0.8 Reinheim**. It validates nodes against the specific feature set defined in the South Era roadmap, including:
* Directory tree name searching (Glob pattern support)
* Recursive subdirectory traversal capabilities

## Feature Modules

### 1. Network Telemetry Aggregator
* **Packet Analysis**: Monitors ingress/egress packet counts (`packets_sent` / `packets_received`).
* **Latency Tracking**: visualizations for round-trip time (RTT) global averages.
* **Storage Metrics**: Real-time calculation of Total Network Storage vs. Committed Capacity.

### 2. Geospatial Visualization Layer
* **WebGL Rendering**: Renders node distribution on a scalable vector map.
* **Coordinate Focusing**: Implements a `focusLocation` state machine to allow deep-linking from a node's detail view to its geospatial coordinate (Zoom Level 4).
* **Status Indication**: Visual differentiation between active nodes (Green), syncing nodes (Yellow), and private nodes.

### 3. Node Inspection & Privacy
* **Hardware Profiling**: Displays utilization metrics for RAM and Disk Space (Used vs. Committed).
* **Protocol Verification**: verifying client version matches the v0.8 Reinheim standard.
* **Privacy Masking**: Automatically detects nodes with hidden geolocation flags or private IP ranges, replacing map coordinates with a generic "Private Network" status to preserve operator anonymity.

## Deployment Guide

### Prerequisites
* **Node.js**: v16.0.0 or higher
* **Package Manager**: npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/brownneth/xandeum-project.git](https://github.com/brownneth/xandeum-project.git)
    cd xplorer-analytics
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the project root.
    ```env
    # Base URL for the Xandeum pNode API
    VITE_API_URL=[https://api.xandeum.network/v1](https://api.xandeum.network/v1)
    
    # Optional: Mock data toggle for development (true/false)
    VITE_USE_MOCK_DATA=false
    ```

4.  **Development Server**
    Start the local development server.
    ```bash
    npm run dev
    ```
    Access the dashboard at `http://localhost:5173`.

5.  **Production Build**
    Compile the application for static hosting (Vercel, Netlify, Nginx).
    ```bash
    npm run build
    ```
    Output files will be located in the `dist/` directory.

## Directory Structure

```text
src/
├── components/         # Atomic UI components
│   ├── charts/         # Recharts wrappers
│   ├── maps/           # Map topology and logic
│   └── common/         # StatCards, Modals
├── hooks/              # Data fetching logic (useNetworkData)
├── layouts/            # Main application shell
├── pages/              # View controllers (Dashboard, Explorer, Detail)
├── services/           # API integration layer
└── utils/              # Formatters (Bytes, Uptime, Geo)

```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

```

```
