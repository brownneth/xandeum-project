import React, { useState } from 'react';
import { Search, ChevronRight, ArrowLeft } from 'lucide-react';
import { formatRelativeTime } from '../utils/formatters';

export const NodeExplorer = ({ nodes, loadMore, hasMore, loading, isDark, onRowClick, onNavigate }) => {
  // Client-Side Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Local Filter: Works instantly on the loaded nodes
  const filteredNodes = nodes.filter(node => 
    node.fullAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper to get consistent badge colors based on theme
  const getStatusColor = (status) => {
    const isOnline = status === 'ONLINE';
    if (isDark) {
      return isOnline 
        ? 'text-green-400 border-green-900 bg-green-900/20' 
        : 'text-red-400 border-red-900 bg-red-900/20';
    } else {
      // Light Mode: Darker text for readability
      return isOnline 
        ? 'text-green-800 border-green-200 bg-green-100' 
        : 'text-red-800 border-red-200 bg-red-100';
    }
  };

  return (
    <div className="animate-fade-in pb-12">
      
      <div className="mb-4">
        <button 
          onClick={() => onNavigate('overview')}
          className={`
            flex items-center gap-2 px-4 py-2 text-xs font-normal rounded-lg transition-all border
            ${isDark 
              ? 'border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white hover:border-blue-600' 
              : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600'}
          `}
        >
          <ArrowLeft size={14} />
          Back to Overview
        </button>
      </div>

      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light mb-1">Node Explorer</h1>
          <p className="text-sm opacity-70">Live Network Participants</p>
        </div>

        <div className="relative w-full md:w-80">
           <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none">
              <Search size={16} />
           </div>
           <input 
             type="text" 
             placeholder="Search IP Address..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className={`w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${isDark ? 'bg-[#262626] border-[#393939] text-white placeholder-gray-500' : 'bg-white border-gray-200'}`} 
           />
        </div>
      </div>
      
      <div className={`overflow-x-auto border rounded shadow-sm ${isDark ? 'bg-[#262626] border-[#393939]' : 'bg-white border-gray-200'}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b ${isDark ? 'border-[#393939] bg-[#393939]' : 'border-gray-200 bg-gray-100'}`}>
              <th className="p-4 text-sm font-semibold">Address (IP:Port)</th>
              <th className="p-4 text-sm font-semibold">Status</th>
              <th className="p-4 text-sm font-semibold">Version</th>
              <th className="p-4 text-sm font-semibold">Storage</th>
              <th className="p-4 text-sm font-semibold">Last Seen</th>
              <th className="p-4 text-sm font-semibold">Location</th>
              <th className="p-4 w-32"></th>
            </tr>
          </thead>
          <tbody>
            {filteredNodes.map((node) => (
              <tr 
                key={node.id} 
                onClick={() => onRowClick(node)}
                className={`border-b transition-colors cursor-pointer group ${isDark ? 'border-[#393939] hover:bg-[#353535]' : 'border-gray-100 hover:bg-gray-50'}`}
              >
                <td className="p-4 font-mono text-sm text-blue-500 font-medium">{node.fullAddress}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(node.status)}`}>
                    {node.status}
                  </span>
                </td>
                <td className="p-4 text-sm opacity-80">{node.version}</td>
                <td className="p-4 text-sm font-mono opacity-80">{node.formattedStorage}</td>
                <td className="p-4 text-sm opacity-60 whitespace-nowrap">{formatRelativeTime(node.lastSeen)}</td>
                <td className="p-4 text-sm opacity-60">
                  {node.location}
                </td>

                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2 text-blue-500">
                    <span className="text-xs font-medium opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                      View Details
                    </span>
                    <ChevronRight size={16} />
                  </div>
                </td>
              </tr>
            ))}
            {filteredNodes.length === 0 && !loading && (
               <tr><td colSpan="7" className="p-8 text-center opacity-50">No nodes found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center">
        {searchQuery ? (
           <div className="text-sm opacity-50">Clear search to load more</div>
        ) : (
          <button 
            onClick={loadMore} 
            disabled={loading || !hasMore}
            className="px-6 py-3 text-sm font-normal text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm rounded-lg disabled:opacity-50"
          >
            {loading ? 'Fetching Network Data...' : hasMore ? 'Load Next 50 Nodes' : 'End of List'}
          </button>
        )}
      </div>
    </div>
  );
};