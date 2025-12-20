import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip
} from 'recharts';
import { formatStorage } from '../../utils/formatters';

export const NetworkHistoryChart = ({ data, isDark }) => {
  const [visibleSeries, setVisibleSeries] = useState({
    storage: true,
    totalNodes: true,
    nodesOnline: true
  });

  const colors = {
    nodes: '#0F62FE', 
    online: '#24A148', 
    storage: '#8A3FFC', 
    grid: isDark ? '#393939' : '#e0e0e0',
    text: isDark ? '#a8a8a8' : '#525252'
  };

  if (!data || data.length === 0) {
    return (
      <div className={`w-full p-4 py-8 border rounded-lg ${isDark ? 'bg-[#161616] border-[#393939]' : 'bg-white border-gray-200'}`}>
         <div className={`h-[350px] w-full rounded animate-pulse ${isDark ? 'bg-[#262626]' : 'bg-gray-100'}`}></div>
      </div>
    );
  }

  const onlineKey = data[0] && 'active_nodes' in data[0] ? 'active_nodes' : 'online_nodes';

  const toggleSeries = (key) => {
    setVisibleSeries(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className={`w-full p-4 py-8 border rounded-lg ${isDark ? 'bg-[#161616] border-[#393939]' : 'bg-white border-gray-200'}`}>
      
      <div className="h-[350px] w-full text-xs font-mono">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.grid} />

            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(t) => new Date(t).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              stroke={colors.text}
              tick={{ fill: colors.text }}
              dy={10} 
            />

            <YAxis 
              yAxisId="left" 
              orientation="left" 
              stroke={colors.nodes}
              tick={{ fill: colors.nodes }}
              label={{ value: 'Nodes', angle: -90, position: 'insideLeft', fill: colors.nodes }}
            />

            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke={colors.storage}
              tick={{ fill: colors.storage }}
              tickFormatter={(bytes) => formatStorage(bytes).split(' ')[0] + ' ' + formatStorage(bytes).split(' ')[1]}
            />

            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDark ? '#262626' : '#ffffff', 
                borderColor: colors.grid,
                borderRadius: '4px',
                color: isDark ? '#fff' : '#000'
              }}
              labelFormatter={(t) => new Date(t).toLocaleString()}
            />
            
            <Area 
              yAxisId="right"
              type="monotone" 
              dataKey="total_storage_committed" 
              name="Storage Capacity" 
              fill={colors.storage} 
              fillOpacity={0.1} 
              stroke={colors.storage} 
              strokeWidth={2}
              hide={!visibleSeries.storage}
            />

            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey="total_nodes" 
              name="Total Nodes" 
              stroke={colors.nodes} 
              strokeWidth={3} 
              dot={false}
              activeDot={{ r: 6 }}
              hide={!visibleSeries.totalNodes}
            />

            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey={onlineKey} 
              name="Nodes Online" 
              stroke={colors.online} 
              strokeWidth={2} 
              strokeDasharray="5 5"
              dot={false}
              connectNulls={true}
              hide={!visibleSeries.nodesOnline}
            />

          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap justify-center gap-6 mt-6 select-none">
        
        <label className={`flex items-center gap-2 cursor-pointer text-xs font-medium ${!visibleSeries.storage && 'opacity-50'}`}>
          <input 
            type="checkbox" 
            checked={visibleSeries.storage} 
            onChange={() => toggleSeries('storage')}
            className="appearance-none w-3 h-3 border border-gray-500 rounded-sm checked:bg-[#8A3FFC] checked:border-[#8A3FFC] focus:outline-none transition-colors"
          />
          <span style={{ color: colors.storage }}>Storage Capacity</span>
        </label>

        <label className={`flex items-center gap-2 cursor-pointer text-xs font-medium ${!visibleSeries.totalNodes && 'opacity-50'}`}>
          <input 
            type="checkbox" 
            checked={visibleSeries.totalNodes} 
            onChange={() => toggleSeries('totalNodes')}
            className="appearance-none w-3 h-3 border border-gray-500 rounded-sm checked:bg-[#0F62FE] checked:border-[#0F62FE] focus:outline-none transition-colors"
          />
          <span style={{ color: colors.nodes }}>Total Nodes</span>
        </label>

        <label className={`flex items-center gap-2 cursor-pointer text-xs font-medium ${!visibleSeries.nodesOnline && 'opacity-50'}`}>
          <input 
            type="checkbox" 
            checked={visibleSeries.nodesOnline} 
            onChange={() => toggleSeries('nodesOnline')}
            className="appearance-none w-3 h-3 border border-gray-500 rounded-sm checked:bg-[#24A148] checked:border-[#24A148] focus:outline-none transition-colors"
          />
          <span style={{ color: colors.online }}>Nodes Online</span>
        </label>
      </div>

    </div>
  );
};