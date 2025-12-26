import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { Plus, Minus } from 'lucide-react';

const worldUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

export const WorldMap = ({ nodes, isDark, focusLocation }) => {
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });


  const validNodes = nodes.filter(n => n.geo && n.geo.lat && n.geo.lng);
  const isScanning = nodes.length > 0 && validNodes.length < nodes.length;
  
  useEffect(() => {
    if (focusLocation) {
      setPosition({
        coordinates: [focusLocation.lng, focusLocation.lat],
        zoom: focusLocation.zoom || 4
      });
    }
  }, [focusLocation]);

  const handleZoomIn = () => {
    if (position.zoom >= 8) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom * 1.2 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom / 1.2 }));
  };

  const handleMoveEnd = (position) => {
    setPosition(position);
  };

  return (
    <div className={`w-full h-full rounded-lg overflow-hidden relative ${isDark ? 'bg-[#161616]' : 'bg-white'}`}>
      <ComposableMap 
        projection="geoMercator" 
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup 
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
          minZoom={1} 
          maxZoom={8}
          translateExtent={[
            [-100, -100],
            [900, 700]    
          ]}
          style={{ transition: 'transform 0.5s ease-out' }}
        >
          <Geographies geography={worldUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isDark ? "#262626" : "#e0e0e0"}
                  stroke={isDark ? "#333" : "#fff"}
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: isDark ? "#393939" : "#cfcfcf", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>
          {validNodes.map((node, i) => (
            <Marker key={`${node.id}-${i}`} coordinates={[node.geo.lng, node.geo.lat]}>
              <circle r={2} fill="#42be65" stroke={isDark ? "#161616" : "#fff"} strokeWidth={0.5} />
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur text-white text-xs px-3 py-2 rounded border border-white/10 pointer-events-none select-none transition-all duration-500">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full transition-colors duration-500 ${
            isScanning 
              ? 'bg-yellow-400 animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.6)]' 
              : 'bg-green-500'
          }`}/>
          
          <span className="font-mono">
            {validNodes.length} Locations Resolved
          </span>
        </div>
      </div>
      <div className="absolute bottom-4 right-4 flex flex-col gap-1">
        <button 
          onClick={handleZoomIn}
          className="p-2 bg-black/80 backdrop-blur text-white border border-white/10 rounded hover:bg-black transition-colors"
          title="Zoom In"
        >
          <Plus size={16} />
        </button>
        <button 
          onClick={handleZoomOut}
          className="p-2 bg-black/80 backdrop-blur text-white border border-white/10 rounded hover:bg-black transition-colors"
          title="Zoom Out"
        >
          <Minus size={16} />
        </button>
      </div>



    </div>
  );
};