import React, { useState } from 'react';
import { Activity, Server, Database, Globe, Clock, ChevronRight } from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { NetworkHistoryChart } from '../components/charts/NetworkHistoryChart';
import { WorldMap } from '../components/maps/WorldMap';
import { useNetworkData } from '../hooks/useNetworkData';

const Dashboard = () => {
  const { nodes, mapNodes, stats, history, loading } = useNetworkData();
  const [isDark, setIsDark] = useState(true);

  if (loading && nodes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 font-mono">Connecting to Xandeum Network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Server}
          label="Total Nodes"
          value={stats.totalNodes}
          subValue={`${stats.onlineNodes} Online`}
          color="blue"
        />
        <StatCard 
          icon={Activity}
          label="Network Health"
          value={`${stats.networkHealth.toFixed(1)}%`}
          subValue="Uptime"
          color="green"
        />
        <StatCard 
          icon={Database}
          label="Total Storage"
          value={stats.totalStorage}
          subValue="Committed"
          color="purple"
        />
        <StatCard 
          icon={Globe}
          label="Active Regions"
          value={new Set(mapNodes.map(n => n.location)).size || 0}
          subValue="Global"
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Network Map - Spans 2 Columns */}
        <div className="lg:col-span-2 bg-[#161616] rounded-xl border border-white/5 p-6 h-[500px] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Globe size={20} className="text-blue-400" />
              Live Network Map
            </h2>
            <div className="flex gap-2">
               <button 
                onClick={() => setIsDark(!isDark)}
                className="text-xs px-3 py-1 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-gray-400"
              >
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </button>
            </div>
          </div>
          <div className="flex-1 rounded-lg overflow-hidden border border-white/5 bg-[#0a0a0a]">
            {/* Pass 'mapNodes' explicitly to the map component */}
            <WorldMap mapNodes={mapNodes} isDark={isDark} />
          </div>
        </div>

        {/* Recent Activity / Status Column */}
        <div className="space-y-6">
          {/* History Chart */}
          <div className="bg-[#161616] rounded-xl border border-white/5 p-6 h-[240px]">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock size={20} className="text-purple-400" />
              24h History
            </h2>
            <div className="h-[160px]">
              <NetworkHistoryChart data={history} />
            </div>
          </div>

          {/* Quick Node List */}
          <div className="bg-[#161616] rounded-xl border border-white/5 p-6 h-[236px] flex flex-col">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Activity size={20} className="text-green-400" />
              Live Nodes
            </h2>
            <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {nodes.slice(0, 10).map((node) => (
                <div key={node.id} className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/5 hover:border-green-500/30 transition-colors group">
                  <div className="flex flex-col">
                    <span className="text-sm font-mono text-gray-300 group-hover:text-green-400 transition-colors">
                      {node.ip_address}
                    </span>
                    <span className="text-xs text-gray-500">{node.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${node.status === 'ONLINE' ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;