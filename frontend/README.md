# Xandeum Network Explorer (Frontend) dev note
> **Version:** v1.0.0 (Initial Release)

## v1.0.0 Release Highlights

* **Real-Time Telemetry:** Connected directly to the live Python backend (`/stats`, `/nodes`).
* **Geo-Spatial Visualization:** Implemented a **Throttled Queue System** to resolve IP addresses to physical Lat/Lon coordinates on a client-side world map.
* **Infinite Scrolling:** Replaced standard pagination with a high-performance infinite scroll for the Node Explorer list.
* **Deep Linking:** Detail views for every individual node with specific metrics (Latency, Version, Storage).
* **Client-Side Search:** Instant filtering of active network participants.

### Design Language

The UI follows the **Carbon Design System** aesthetic, implemented via **Tailwind CSS**.

### Folder Structure

```text
src/
├── services/        # PURE API LAYER
│   └── api.js       # Centralized fetch calls (getStats, getNodes)
│
├── hooks/           # BUSINESS LOGIC
│   └── useNetworkData.js # Custom hook managing pagination, geo-queue, and caching
│
├── layouts/         # STRUCTURE
│   └── MainLayout.jsx    # Global wrapper (Header + Content Area)
│
├── pages/           # VIEWS
│   ├── Dashboard.jsx     # High-level metrics & World Map
│   ├── NodeExplorer.jsx  # Searchable, infinite-scroll list
│   └── NodeDetail.jsx    # Individual node inspection
│
├── components/      # UI BLOCKS
│   ├── maps/        # World Map visualization logic
│   └── common/      # Reusable UI (StatCards, Buttons)
│
└── utils/           # HELPERS
    └── formatters.js     # Byte conversion (TB/PB) & Relative Time logic