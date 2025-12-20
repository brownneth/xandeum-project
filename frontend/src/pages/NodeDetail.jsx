import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Server, 
  MapPin, 
  Activity, 
  Shield, 
  Globe, 
  Copy, 
  Check, 
  Cpu, 
  HardDrive,
  Zap,
  Network,
  ArrowUpRight,
  ArrowDownLeft,
  ScanEye
} from 'lucide-react';
import { formatRelativeTime, formatBytes, formatUptime, formatNumber } from '../utils/formatters';

export const NodeDetail = ({ item, onBack, isDark, onViewOnMap }) => {
  const [activeTab, setActiveTab] = useState('metrics');
  const [copied, setCopied] = useState(false);

  if (!item) return null;


  const isPrivate = item.node_type === 'Private Node' || !item.geo;
  const nodeTypeLabel = item.node_type || (isPrivate ? 'Private Node' : 'Public Node');


  const storageUsed = item.storage_used_bytes || 0;
  const storageTotal = item.storage_committed_bytes || item.storage || 1;
  const storagePercent = Math.min(((storageUsed / storageTotal) * 100), 100);


  const ramUsed = item.ram_used_bytes || 0;
  const ramTotal = item.ram_total_bytes || 0;
  const ramPercent = ramTotal > 0 ? Math.min(((ramUsed / ramTotal) * 100), 100) : 0;
  const showRam = ramTotal > 0;


  const packetsSent = item.packets_sent || 0;
  const packetsReceived = item.packets_received || 0;
  

  const colors = isDark 
    ? { 
        bg: 'bg-[#161616]', 
        card: 'bg-[#262626]', 
        border: 'border-[#393939]', 
        text: 'text-white', 
        subText: 'text-[#8d8d8d]',
        accent: 'text-[#0F62FE]', 
        success: 'text-[#24A148]',
        progressBg: 'bg-[#393939]'
      }
    : { 
        bg: 'bg-[#f4f4f4]', 
        card: 'bg-white', 
        border: 'border-gray-200', 
        text: 'text-gray-900', 
        subText: 'text-gray-500',
        accent: 'text-blue-600',
        success: 'text-green-600',
        progressBg: 'bg-gray-100'
      };

  const handleCopyId = () => {
    navigator.clipboard.writeText(item.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status) => {
    const isOnline = status === 'ONLINE';
    if (isDark) {
      return isOnline 
        ? 'text-green-400 border-green-900 bg-green-900/20' 
        : 'text-red-400 border-red-900 bg-red-900/20';
    } else {
      return isOnline 
        ? 'text-green-800 border-green-200 bg-green-100' 
        : 'text-red-800 border-red-200 bg-red-100';
    }
  };

  return (
    <div className="animate-fade-in flex flex-col h-full w-full mx-auto pb-12">
      
      {/* 1. TOP NAVIGATION */}
      <div className="mb-6">
        <button 
          onClick={onBack} 
          className={`
            flex items-center gap-2 px-4 py-2 text-xs font-normal rounded-lg transition-all border
            ${isDark 
              ? 'border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white hover:border-blue-600' 
              : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600'}
          `}
        >
          <ArrowLeft size={14} />
          Back to Explorer
        </button>
      </div>

      {/* 2. HEADER CARD */}
      <div className={`${colors.card} border ${colors.border} p-6 mb-8 rounded-lg shadow-sm`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           
           <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h2 className={`text-2xl font-light font-mono ${colors.text}`}>
                  {item.fullAddress}
                </h2>
                
                <span className={`text-[10px] px-2 py-0.5 border rounded font-bold uppercase tracking-wider ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>

                <span className={`text-[10px] px-2 py-0.5 border rounded font-bold uppercase tracking-wider flex items-center gap-1 ${
                  isPrivate
                    ? (isDark ? 'text-purple-400 border-purple-900 bg-purple-900/20' : 'text-purple-800 border-purple-200 bg-purple-100')
                    : (isDark ? 'text-blue-400 border-blue-900 bg-blue-900/20' : 'text-blue-800 border-blue-200 bg-blue-50')
                }`}>
                  {isPrivate ? <Shield size={10} /> : <Globe size={10} />}
                  {nodeTypeLabel}
                </span>
              </div>

              <div className={`text-xs ${colors.subText} font-mono flex flex-wrap items-center gap-4`}>
                <div 
                  className={`flex items-center gap-2 group cursor-pointer transition-colors ${isDark ? 'hover:text-white' : 'hover:text-black'}`} 
                  onClick={handleCopyId}
                  title="Click to copy Node ID"
                >
                  <span>ID: {item.id}</span>
                  {copied ? <Check size={12} className={isDark ? 'text-green-400' : 'text-green-600'} /> : <Copy size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                </div>
                
                <span className="w-1 h-1 rounded-full bg-gray-500 opacity-50"/>
                <span>Last Seen: {formatRelativeTime(item.lastSeen)}</span>
                <span className="w-1 h-1 rounded-full bg-gray-500 opacity-50"/>
                <span>Version: {item.version}</span>
              </div>
           </div>
        </div>
      </div>

      {/* 3. TABS */}
      <div className="mb-8 border-b border-[#393939]">
        <div className="flex gap-8">
          {['metrics', 'configuration'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors capitalize ${
                activeTab === tab 
                  ? 'border-[#0F62FE] text-[#0F62FE]' 
                  : 'border-transparent opacity-60 hover:opacity-100 hover:text-gray-400'
              } ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 4. CONTENT AREA */}
      {activeTab === 'metrics' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            
            {/* Storage Card */}
            <div className={`${colors.card} border ${colors.border} p-6 rounded-lg flex flex-col`}>
                <div className="flex items-center gap-2 mb-6">
                    <HardDrive size={18} className={colors.accent} />
                    <h3 className={`text-sm font-semibold uppercase tracking-wider ${colors.text}`}>Storage Capacity</h3>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-end mb-2">
                        <span className={`text-3xl font-light ${colors.text}`}>
                          {formatBytes(storageTotal)}
                        </span>
                        <span className={`text-xs font-mono ${colors.subText}`}>
                           {storagePercent.toFixed(1)}% Used
                        </span>
                    </div>

                    <div className={`w-full h-2 rounded-sm overflow-hidden ${colors.progressBg}`}>
                        <div 
                           className={`h-full transition-all duration-1000 ease-out ${storagePercent > 90 ? 'bg-red-500' : 'bg-[#0F62FE]'}`} 
                           style={{ width: `${Math.max(storagePercent, 1)}%` }} 
                        />
                    </div>
                    
                    <div className="mt-3 flex justify-between text-[10px] uppercase font-mono opacity-60">
                        <span className={colors.subText}>Used: {formatBytes(storageUsed)}</span>
                        <span className={colors.subText}>Total: {formatBytes(storageTotal)}</span>
                    </div>
                </div>
            </div>

            {/* Memory Card */}
            {showRam && (
               <div className={`${colors.card} border ${colors.border} p-6 rounded-lg flex flex-col`}>
                  <div className="flex items-center gap-2 mb-6">
                      <Cpu size={18} className={colors.accent} />
                      <h3 className={`text-sm font-semibold uppercase tracking-wider ${colors.text}`}>Memory Usage</h3>
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-end mb-2">
                          <span className={`text-3xl font-light ${colors.text}`}>
                            {formatBytes(ramUsed)}
                          </span>
                          <span className={`text-xs font-mono ${colors.subText}`}>
                            {ramPercent.toFixed(1)}%
                          </span>
                      </div>

                      <div className={`w-full h-2 rounded-sm overflow-hidden ${colors.progressBg}`}>
                          <div 
                            className={`h-full transition-all duration-1000 ease-out ${ramPercent > 90 ? 'bg-red-500' : 'bg-[#24A148]'}`} 
                            style={{ width: `${Math.max(ramPercent, 1)}%` }} 
                          />
                      </div>
                      
                      <div className="mt-3 flex justify-between text-[10px] uppercase font-mono opacity-60">
                          <span className={colors.subText}>Active</span>
                          <span className={colors.subText}>Total: {formatBytes(ramTotal)}</span>
                      </div>
                  </div>
               </div>
            )}

            {/* Location Card WITH "VIEW ON MAP" BUTTON */}
            <div className={`${colors.card} border ${colors.border} p-6 rounded-lg relative overflow-hidden`}>
                <div className="flex items-center gap-2 mb-4 relative z-10">
                    <MapPin size={18} className={isPrivate ? 'text-purple-500' : colors.success} />
                    <h3 className={`text-sm font-semibold uppercase tracking-wider ${colors.text}`}>Physical Location</h3>
                    
                    {!isPrivate && (
                        <button 
                          onClick={() => onViewOnMap(item)}
                          className={`
                             ml-auto flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium tracking-wide border transition-all
                             ${isDark 
                               ? 'border-blue-900 bg-blue-900/10 text-blue-400 hover:bg-blue-900/30' 
                               : 'border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100'}
                          `}
                        >
                           <ScanEye size={12} />
                           VIEW ON MAP
                        </button>
                    )}
                </div>

                <div className="flex-1 flex flex-col justify-center relative z-10">
                    {isPrivate ? (
                        <div className="flex flex-col items-center justify-center py-4 opacity-70">
                            <Shield size={48} className={`mb-3 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                            <span className={`text-sm font-mono ${colors.text}`}>Private Node</span>
                            <span className="text-xs">Location Data Hidden</span>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex justify-between border-b border-dashed border-gray-700 pb-2">
                                <span className={colors.subText}>Region</span>
                                <span className={`font-mono ${colors.text}`}>{item.location}</span>
                            </div>
                            <div className="flex justify-between border-b border-dashed border-gray-700 pb-2">
                                <span className={colors.subText}>Latitude</span>
                                <span className={`font-mono ${colors.text}`}>{item.geo?.lat?.toFixed(4) || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={colors.subText}>Longitude</span>
                                <span className={`font-mono ${colors.text}`}>{item.geo?.lng?.toFixed(4) || 'N/A'}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Network Activity */}
            <div className={`${showRam ? '' : 'md:col-span-2'} ${colors.card} border ${colors.border} p-6 rounded-lg`}>
                <div className="flex items-center gap-2 mb-6">
                    <Network size={18} className={colors.accent} />
                    <h3 className={`text-sm font-semibold uppercase tracking-wider ${colors.text}`}>Network Activity</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded border ${colors.border} bg-opacity-50`}>
                        <div className={`text-xs ${colors.subText} uppercase tracking-wider mb-1`}>Packets Sent</div>
                        <div className={`text-2xl font-light ${colors.text} flex items-center gap-2`}>
                           {formatNumber(packetsSent)}

                           <ArrowUpRight size={16} className="text-blue-500 opacity-70"/>
                        </div>
                    </div>
                    <div className={`p-4 rounded border ${colors.border} bg-opacity-50`}>
                        <div className={`text-xs ${colors.subText} uppercase tracking-wider mb-1`}>Packets Rcvd</div>
                        <div className={`text-2xl font-light ${colors.text} flex items-center gap-2`}>
                           {formatNumber(packetsReceived)}

                           <ArrowDownLeft size={16} className="text-green-500 opacity-70"/>
                        </div>
                    </div>
                </div>
                <div className={`mt-4 pt-3 border-t border-dashed ${isDark ? 'border-gray-800' : 'border-gray-200'} flex justify-between items-center`}>
                    <span className={`text-xs ${colors.subText}`}>Network Health Score</span>
                    <div className="flex items-center gap-2">
                       <Activity size={14} className={colors.success} />
                       <span className={`font-mono text-sm ${colors.text}`}>Active</span>
                    </div>
                </div>
            </div>

        </div>
      ) : (
        /* CONFIGURATION TAB CONTENT */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
           
           <div className={`${colors.card} border ${colors.border} p-6 rounded-lg`}>
              <div className="flex items-center gap-2 mb-6">
                 <Server size={18} className={colors.accent} />
                 <h3 className={`text-sm font-semibold uppercase tracking-wider ${colors.text}`}>System Information</h3>
              </div>
              <div className="space-y-4 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-800">
                      <span className={colors.subText}>Node Type</span>
                      <span className={`font-mono ${colors.text}`}>{nodeTypeLabel}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-800">
                      <span className={colors.subText}>Client Version</span>
                      <span className={`font-mono ${colors.text}`}>{item.version}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-800">
                      <span className={colors.subText}>Protocol</span>
                      <span className={`font-mono ${colors.text}`}>v0.8 (Reinheim)</span>
                  </div>
                  {item.rpc_port && (
                    <div className="flex justify-between py-2 border-b border-gray-800">
                        <span className={colors.subText}>RPC Port</span>
                        <span className={`font-mono ${colors.text}`}>{item.rpc_port}</span>
                    </div>
                  )}
              </div>
           </div>

           <div className={`${colors.card} border ${colors.border} p-6 rounded-lg`}>
              <div className="flex items-center gap-2 mb-6">
                 <Zap size={18} className={colors.accent} />
                 <h3 className={`text-sm font-semibold uppercase tracking-wider ${colors.text}`}>Runtime Status</h3>
              </div>
              <div className="space-y-4 text-sm">
                   <div className="flex justify-between py-2 border-b border-gray-800">
                       <span className={colors.subText}>Uptime</span>
                       <span className={`font-mono ${colors.text}`}>{formatUptime(item.uptime_seconds)}</span>
                   </div>
                   
                   {item.os ? (
                      <div className="flex justify-between py-2 border-b border-gray-800">
                          <span className={colors.subText}>Operating System</span>
                          <span className={`font-mono ${colors.text}`}>{item.os}</span>
                      </div>
                   ) : (
                      <div className="flex justify-between py-2 border-b border-gray-800">
                          <span className={colors.subText}>Host System</span>

                          <span className={`font-mono text-xs italic ${colors.subText}`}>Not available</span>
                      </div>
                   )}
              </div>
           </div>

        </div>
      )}

    </div>
  );
};