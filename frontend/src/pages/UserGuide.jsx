import React from 'react';
import { ArrowLeft, CheckCircle, AlertTriangle, Shield, Globe, HardDrive, Activity, Wifi } from 'lucide-react';

export const UserGuide = ({ onBack, isDark }) => {
  const theme = isDark 
    ? { 
        bg: 'bg-[#161616]', text: 'text-[#f4f4f4]', 
        card: 'bg-[#262626]', border: 'border-[#393939]', 
        subText: 'text-gray-400',
        code: 'bg-[#161616] border-[#333]',
        success: 'text-[#42be65]', critical: 'text-[#fa4d56]', warn: 'text-[#f1c21b]'
      }
    : { 
        bg: 'bg-[#f4f4f4]', text: 'text-[#161616]', 
        card: 'bg-white', border: 'border-gray-200', 
        subText: 'text-gray-600',
        code: 'bg-gray-100 border-gray-300',
        success: 'text-[#24a148]', critical: 'text-[#da1e28]', warn: 'text-[#b28600]'
      };

  return (
    <div className={`animate-fade-in max-w-5xl mx-auto pb-12 ${theme.text}`}>
      <div className="mb-10 pt-4">
        <button 
          onClick={onBack} 
          className={`flex items-center gap-2 px-4 py-2 text-xs font-normal rounded-lg transition-all border mb-6 ${isDark ? 'border-transparent hover:bg-[#353535]' : 'border-transparent hover:bg-gray-200'}`}
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-light mb-2">Operator Manual</h1>
        <p className="text-lg opacity-60 font-light">Troubleshooting and diagnostics for the v0.8 Reinheim Network.</p>
      </div>

      <div className="space-y-12">

        <section>
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className={theme.success} size={20} />
            <h2 className="text-xl font-normal">1. Verifying Node Compliance</h2>
          </div>
          <div className={`p-6 rounded-lg border ${theme.card} ${theme.border}`}>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1">
                <p className={`mb-4 ${theme.subText}`}>
                  To participate in the current South Era, your node must be synchronized with the <strong>v0.8 Reinheim</strong> update to support glob pattern searches.
                </p>
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="w-20 font-medium">Check:</span>
                        <span>Configuration Tab &rarr; Protocol</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="w-20 font-medium">Target:</span>
                        <code className={`px-2 py-0.5 rounded text-xs font-mono border ${theme.code} ${theme.success}`}>v0.8 (Reinheim)</code>
                    </div>
                </div>
              </div>
              <div className={`p-4 rounded border w-full md:w-1/3 text-sm ${isDark ? 'bg-blue-900/10 border-blue-900/30 text-blue-200' : 'bg-blue-50 border-blue-100 text-blue-800'}`}>
                <strong className="block mb-1">Why it matters:</strong>
                Nodes on older versions cannot process the new recursive <code>find</code> operations and may be penalized by the network.
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Activity className={theme.success} size={20} />
            <h2 className="text-xl font-normal">2. Reading Your Telemetry</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-lg border ${theme.card} ${theme.border} flex flex-col`}>
              <div className="flex items-center gap-2 mb-4 text-blue-400">
                <HardDrive size={18} />
                <h3 className="font-medium text-sm uppercase tracking-wide">Storage Load</h3>
              </div>
              <p className={`text-sm mb-4 flex-1 ${theme.subText}`}>
                <strong>Committed</strong> is your pledge. <strong>Used</strong> is the actual client data load.
              </p>
              <div className="space-y-2 text-sm font-mono border-t pt-4 border-dashed border-gray-700">
                <div className={`flex justify-between ${theme.success}`}>
                  <span>&lt; 80%</span>
                  <span>Healthy</span>
                </div>
                <div className={`flex justify-between ${theme.critical}`}>
                  <span>&gt; 90%</span>
                  <span>Critical</span>
                </div>
                <div className="mt-2 text-xs opacity-60">
                  Action: Add physical drives if Critical.
                </div>
              </div>
            </div>
            <div className={`p-6 rounded-lg border ${theme.card} ${theme.border} flex flex-col`}>
              <div className="flex items-center gap-2 mb-4 text-purple-400">
                <Activity size={18} />
                <h3 className="font-medium text-sm uppercase tracking-wide">Packet Flow</h3>
              </div>
              <p className={`text-sm mb-4 flex-1 ${theme.subText}`}>
                Ingress/Egress gossip traffic. Validates connectivity.
              </p>
              <div className="space-y-2 text-sm font-mono border-t pt-4 border-dashed border-gray-700">
                <div className={`flex justify-between ${theme.success}`}>
                  <span>Rising</span>
                  <span>Connected</span>
                </div>
                <div className={`flex justify-between ${theme.critical}`}>
                  <span>0 Rcvd</span>
                  <span>Blocked</span>
                </div>
                <div className="mt-2 text-xs opacity-60">
                  Action: Check Firewall/Ports if 0.
                </div>
              </div>
            </div>
            <div className={`p-6 rounded-lg border ${theme.card} ${theme.border} flex flex-col`}>
              <div className="flex items-center gap-2 mb-4 text-orange-400">
                <Wifi size={18} />
                <h3 className="font-medium text-sm uppercase tracking-wide">Latency (RTT)</h3>
              </div>
              <p className={`text-sm mb-4 flex-1 ${theme.subText}`}>
                Round-trip time to nearest peers.
              </p>
              <div className="space-y-2 text-sm font-mono border-t pt-4 border-dashed border-gray-700">
                <div className={`flex justify-between ${theme.success}`}>
                  <span>&lt; 100ms</span>
                  <span>Optimal</span>
                </div>
                <div className={`flex justify-between ${theme.warn}`}>
                  <span>&gt; 300ms</span>
                  <span>Lagging</span>
                </div>
                <div className="mt-2 text-xs opacity-60">
                  Action: Check internet stability.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Shield className={theme.success} size={20} />
            <h2 className="text-xl font-normal">3. Privacy Configuration</h2>
          </div>
          <div className={`grid md:grid-cols-2 gap-6`}>
             <div className={`p-6 rounded-lg border flex items-start gap-4 ${isDark ? 'bg-blue-900/10 border-blue-900/30' : 'bg-blue-50 border-blue-100'}`}>
                <Globe className="text-blue-500 shrink-0" size={24} />
                <div>
                   <h3 className="font-medium mb-1 text-blue-400">Public Node</h3>
                   <p className={`text-sm ${theme.subText} mb-2`}>
                     Broadcasting public IP and geospatial data.
                   </p>
                   <div className="text-xs font-mono opacity-70">
                     Feature: "View on Map" Enabled
                   </div>
                </div>
             </div>
             <div className={`p-6 rounded-lg border flex items-start gap-4 ${isDark ? 'bg-purple-900/10 border-purple-900/30' : 'bg-purple-50 border-purple-100'}`}>
                <Shield className="text-purple-500 shrink-0" size={24} />
                <div>
                   <h3 className="font-medium mb-1 text-purple-400">Private Node</h3>
                   <p className={`text-sm ${theme.subText} mb-2`}>
                     Masked IP. Geolocation disabled for anonymity.
                   </p>
                   <div className="text-xs font-mono opacity-70">
                     Feature: "Location Hidden" Badge
                   </div>
                </div>
             </div>

          </div>
        </section>

      </div>
    </div>
  );
};