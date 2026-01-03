import React from 'react';
import { Activity, Server, Database, Globe, Clock } from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { NetworkHistoryChart } from '../components/charts/NetworkHistoryChart';
import { WorldMap } from '../components/maps/WorldMap';
import { useNetworkData } from '../hooks/useNetworkData';

export const Dashboard = ({ isDark, onNavigate, mapFocus }) => {
  const { nodes, mapNodes, stats, history, loading } = useNetworkData();
  

  if (loading && nodes.length === 0) {
    return (
      <div className={`flex items-center justify-center min-h-[50vh] ${isDark ? 'text-white' : 'text-gray-900'}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-mono opacity-70">Connecting to Xandeum Network...</p>
        </div>
      </div>
    );
  }

  const theme = isDark ? {
    cardBg: 'bg-[#161616]',
    borderColor: 'border-white/5',
    textColor: 'text-white',
    subText: 'text-gray-500',
    chartBg: 'bg-[#0a0a0a]'
  } : {
    cardBg: 'bg-white',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-900',
    subText: 'text-gray-500',
    chartBg: 'bg-gray-50'
  };

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
          isDark={isDark}
        />
        <StatCard 
          icon={Activity}
          label="Network Health"
          value={`${stats.networkHealth.toFixed(1)}%`}
          subValue="Uptime"
          color="green"
          isDark={isDark}
        />
        <StatCard 
          icon={Database}
          label="Total Storage"
          value={stats.totalStorage}
          subValue="Committed"
          color="purple"
          isDark={isDark}
        />
        <StatCard 
          icon={Globe}
          label="Active Regions"
          value={new Set(mapNodes.map(n => n.location)).size || 0}
          subValue="Global"
          color="orange"
          isDark={isDark}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Network Map - Spans 2 Columns */}
        <div className={`lg:col-span-2 rounded-xl border p-6 h-[500px] flex flex-col ${theme.cardBg} ${theme.borderColor}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-semibold flex items-center gap-2 ${theme.textColor}`}>
              <Globe size={20} className="text-blue-400" />
              Live Network Map
            </h2>

          </div>
          <div className={`flex-1 rounded-lg overflow-hidden border ${theme.borderColor} ${theme.chartBg}`}>
            {/* INJECTED FIX: Passing mapNodes instead of nodes */}
            <WorldMap mapNodes={mapNodes} isDark={isDark} focusLocation={mapFocus} />
          </div>
        </div>

        {/* Recent Activity / Status Column */}
        <div className="space-y-6">
          {/* History Chart */}
          <div className={`rounded-xl border p-6 h-[240px] ${theme.cardBg} ${theme.borderColor}`}>
            <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${theme.textColor}`}>
              <Clock size={20} className="text-purple-400" />
              24h History
            </h2>
            <div className="h-[160px]">
              <NetworkHistoryChart data={history} isDark={isDark} />
            </div>
          </div>

          {/* Quick Node List */}
          <div className={`rounded-xl border p-6 h-[236px] flex flex-col ${theme.cardBg} ${theme.borderColor}`}>
            <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${theme.textColor}`}>
              <Activity size={20} className="text-green-400" />
              Live Nodes
            </h2>
            <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
              {nodes.slice(0, 10).map((node) => (
                <div key={node.id} className={`flex items-center justify-between p-3 rounded border transition-colors group ${isDark ? 'bg-white/5 border-white/5 hover:border-green-500/30' : 'bg-gray-50 border-gray-100 hover:border-green-500/30'}`}>
                  <div className="flex flex-col">
                    <span className="text-sm font-mono text-blue-500 font-medium">
                      {node.ip_address}
                    </span>
                    <span className={`text-xs ${theme.subText}`}>{node.location}</span>
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

