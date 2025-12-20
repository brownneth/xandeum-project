import React from 'react';
import { Server, Database, CheckCircle, Activity, ArrowRight } from 'lucide-react';
import { WorldMap } from '../components/maps/WorldMap';
import { StatCard } from '../components/common/StatCard';
import { NetworkHistoryChart } from '../components/charts/NetworkHistoryChart';

export const Dashboard = ({ stats, nodes, history, isDark, onNavigate, mapFocus }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light mb-1">Network Overview</h1>
          <p className="text-sm opacity-70">Real-time telemetry</p>
        </div>
        
        <button 
          onClick={() => onNavigate('nodes')}
          className={`
            flex items-center gap-2 px-5 py-2.5 text-sm font-normal rounded-lg transition-all border
            ${isDark 
              ? 'border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white hover:border-blue-600' 
              : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600'}
          `}
        >
          Go to Node Explorer
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Nodes" value={stats.totalNodes} isDark={isDark} icon={Server} />
        <StatCard label="Active Nodes" value={stats.onlineNodes} status="healthy" subLabel={`${stats.networkHealth.toFixed(1)}% Health`} isDark={isDark} icon={CheckCircle} />
        <StatCard label="Total Storage" value={stats.totalStorage} isDark={isDark} icon={Database} />
        <StatCard label="Avg. Latency" value="42 ms" subLabel="Global Average" isDark={isDark} icon={Activity} />
      </div>

      <div className="mt-8">
        <div className="mb-4">
            <h3 className="text-lg font-normal">Network Growth & Capacity</h3>
            <p className="text-sm opacity-70">30-Day Historical Trend</p>
        </div>
        <NetworkHistoryChart data={history} isDark={isDark} />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-normal mb-4">Global Node Distribution</h3>
        <div className={`w-full h-[500px] border rounded-lg overflow-hidden relative ${isDark ? 'bg-[#161616] border-[#393939]' : 'bg-white border-gray-200'}`}>
           {/* zoom effect */}
           <WorldMap nodes={nodes} isDark={isDark} focusLocation={mapFocus} />
        </div>
      </div>
    </div>
  );
};