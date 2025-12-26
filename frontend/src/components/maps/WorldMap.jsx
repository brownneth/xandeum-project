import React, { useState, useEffect, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { Plus, Minus, X, ArrowRight, Server, Activity } from 'lucide-react';

const worldUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

const countryCodeMap = {
  "US": "United States of America",
  "DE": "Germany",
  "FR": "France",
  "GB": "United Kingdom",
  "IN": "India",
  "NG": "Nigeria",
  "SG": "Singapore",
  "JP": "Japan",
  "BR": "Brazil",
  "AU": "Australia",
  "CA": "Canada",
  "CN": "China",
  "RU": "Russia",
  "ZA": "South Africa"
};

export const WorldMap = ({ nodes, isDark, focusLocation, onSelectCountry }) => {
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const [selectedCountry, setSelectedCountry] = useState(null);
  
  const validNodes = nodes.filter(n => n.lat && n.lon);
  const isScanning = nodes.length > 0 && validNodes.length < nodes.length;
  

  const getStatsForCountry = (geo) => {
    const mapCountryName = geo.properties.name;

    const relevantNodes = nodes.filter(n => {
        if (!n.country) return false;
        const mappedName = countryCodeMap[n.country];
        return mappedName === mapCountryName;
    });

    if (relevantNodes.length === 0) return null;

    const totalLatency = relevantNodes.reduce((acc, n) => acc + (n.latency || 0), 0);
    const avgLatency = Math.round(totalLatency / relevantNodes.length);

    return {
        name: mapCountryName,
        count: relevantNodes.length,
        nodes: relevantNodes,
        avgLatency,
        percent: ((relevantNodes.length / nodes.length) * 100).toFixed(1)
    };
  };

  const handleCountryClick = (geo) => {
    const stats = getStatsForCountry(geo);
    
    if (stats) {

        setSelectedCountry(stats);
    } else {
        setSelectedCountry(null);
    }
  };

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
          translateExtent={[[-100, -100], [900, 700]]}
          style={{ transition: 'transform 0.5s ease-out' }}
        >
          <Geographies geography={worldUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const mapCountryName = geo.properties.name;
                
                const hasNodes = nodes.some(n => {
                    if (!n.country) return false;
                    return countryCodeMap[n.country] === mapCountryName;
                });

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleCountryClick(geo)}
                    fill={isDark ? "#262626" : "#e0e0e0"}
                    stroke={isDark ? "#333" : "#fff"}
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none", transition: "all 0.3s" },
                      hover: { 
                        fill: hasNodes ? (isDark ? "#1e3a8a" : "#93c5fd") : (isDark ? "#393939" : "#cfcfcf"), 
                        outline: "none", 
                        cursor: hasNodes ? "pointer" : "default" 
                      },
                      pressed: { outline: "none" },
                    }}

                  />
                );
              })
            }
          </Geographies>
          {validNodes.map((node, i) => (
            <Marker key={`${node.ip_address}-${i}`} coordinates={[node.lon, node.lat]}>
              <circle r={2} fill="#42be65" stroke={isDark ? "#161616" : "#fff"} strokeWidth={0.5} />
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur text-white text-xs px-3 py-2 rounded border border-white/10 pointer-events-none select-none transition-all duration-500 z-10">
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

      <div className="absolute bottom-4 right-4 flex flex-col gap-1 z-10">
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

      <div 
        className={`
            absolute top-0 right-0 h-full w-80 shadow-2xl z-20 
            transform transition-transform duration-300 ease-in-out
            border-l ${isDark ? 'border-[#393939] bg-[#161616] text-white' : 'border-gray-200 bg-white text-gray-900'}
            ${selectedCountry ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {selectedCountry && (
          <div className="h-full flex flex-col p-6">

             <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-xl font-light tracking-wide">{selectedCountry.name}</h3>
                    <p className="text-xs opacity-60 uppercase tracking-widest mt-1">Region Inspector</p>
                </div>
                <button 
                  onClick={() => setSelectedCountry(null)}
                  className={`p-1 rounded opacity-50 hover:opacity-100 transition-opacity ${isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}
                >
                  <X size={20} />
                </button>
             </div>

             <div className="mb-8">
                 <div className="flex items-center gap-3 mb-2">
                     <Server className="text-blue-500" size={24} />
                     <span className="text-4xl font-light">{selectedCountry.count}</span>
                 </div>
                 <div className="text-sm opacity-60">Active Nodes Found</div>
             </div>

             <div className="grid grid-cols-2 gap-4 mb-8">
                <div className={`p-3 rounded border ${isDark ? 'border-[#333] bg-[#262626]' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="text-[10px] uppercase opacity-60 mb-1">Network Share</div>
                    <div className="text-xl font-mono">{selectedCountry.percent}%</div>
                </div>
                <div className={`p-3 rounded border ${isDark ? 'border-[#333] bg-[#262626]' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="text-[10px] uppercase opacity-60 mb-1">Avg Latency</div>
                    <div className={`text-xl font-mono ${selectedCountry.avgLatency < 100 ? 'text-green-500' : 'text-yellow-500'}`}>
                        {selectedCountry.avgLatency}ms
                    </div>
                </div>
             </div>

             <div className="mb-auto">
                 <div className="flex items-center gap-2 mb-2 opacity-70">
                    <Activity size={14} />
                    <span className="text-xs">Connection Quality</span>
                 </div>
                 <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-blue-500 transition-all duration-500" 
                        style={{ width: `${Math.min(100, 100 - (selectedCountry.avgLatency / 5))}%` }} 
                    />
                 </div>
                 <div className="flex justify-between text-[10px] opacity-40 mt-1 font-mono">
                    <span>0ms</span>
                    <span>500ms+</span>
                 </div>
             </div>

             <div className="mt-6 border-t border-dashed border-gray-700 pt-6">
                 <button 
                    onClick={() => {
                        if (onSelectCountry) onSelectCountry(selectedCountry.name);
                        setSelectedCountry(null);
                    }}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center gap-2 text-sm font-medium transition-colors shadow-lg shadow-blue-900/20"
                 >
                    View Node List
                    <ArrowRight size={16} />
                 </button>
             </div>

          </div>
        )}
      </div>

    </div>
  );
};