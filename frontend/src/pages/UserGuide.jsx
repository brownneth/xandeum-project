import React from 'react';
import { ArrowLeft, BookOpen, Activity, Shield, Cpu, Network } from 'lucide-react';

export const UserGuide = ({ onBack, isDark }) => {
  const theme = isDark 
    ? { 
        bg: 'bg-[#161616]', 
        text: 'text-[#f4f4f4]', 
        muted: 'text-[#c6c6c6]',
        border: 'border-[#393939]', 
        tableHeader: 'bg-[#262626]',
        code: 'bg-[#262626] border-[#393939] text-[#f4f4f4]',
        callout: 'bg-blue-900/10 border-blue-900/30 text-blue-200'
      }
    : { 
        bg: 'bg-[#f4f4f4]', 
        text: 'text-[#161616]', 
        muted: 'text-[#525252]',
        border: 'border-gray-200', 
        tableHeader: 'bg-gray-100',
        code: 'bg-gray-100 border-gray-200 text-gray-800',
        callout: 'bg-blue-50 border-blue-100 text-blue-800'
      };

  return (
    <div className={`animate-fade-in w-full pb-20 ${theme.text}`}>
      
      <div className="max-w-3xl mx-auto pt-8">
        <button 
          onClick={onBack} 
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-normal rounded-md transition-all border mb-8 ${isDark ? 'border-transparent hover:bg-[#353535] text-gray-400' : 'border-transparent hover:bg-gray-200 text-gray-600'}`}
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </button>

        <header className="mb-12 border-b border-dashed border-gray-700/50 pb-8">
          <div className="flex items-center gap-3 mb-4">
             <BookOpen size={24} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
             <h1 className="text-3xl font-normal tracking-tight">Operator Manual</h1>
          </div>
          <p className={`text-lg font-light leading-relaxed ${theme.muted}`}>
            Reference documentation for interpreting node telemetry, verifying protocol compliance, and troubleshooting network connectivity in the v0.8 Reinheim era.
          </p>
        </header>

        <div className="space-y-16">

          <section>
            <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
              <Activity size={18} />
              Diagnostic Thresholds
            </h2>
            <p className={`mb-6 text-sm ${theme.muted}`}>
              XPLORER monitors three key health metrics. Use the table below to interpret your node's performance status.
            </p>
            
            <div className={`rounded-lg border overflow-hidden ${theme.border}`}>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className={`border-b ${theme.border} ${theme.tableHeader}`}>
                    <th className="p-4 font-semibold w-1/4">Metric</th>
                    <th className="p-4 font-semibold w-1/4">Healthy Range</th>
                    <th className="p-4 font-semibold w-1/4">Critical Threshold</th>
                    <th className="p-4 font-semibold">Recommended Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/30">
                  <tr className={theme.bg}>
                    <td className="p-4 font-mono text-xs">Storage Load</td>
                    <td className="p-4 text-green-500">&lt; 80%</td>
                    <td className="p-4 text-red-500">&gt; 90%</td>
                    <td className={`p-4 ${theme.muted}`}>Add physical drives to increase Committed Capacity.</td>
                  </tr>
                  <tr className={theme.bg}>
                    <td className="p-4 font-mono text-xs">Packet Flow</td>
                    <td className="p-4 text-green-500">Rising Count</td>
                    <td className="p-4 text-red-500">0 Received</td>
                    <td className={`p-4 ${theme.muted}`}>Check port forwarding and firewall rules.</td>
                  </tr>
                  <tr className={theme.bg}>
                    <td className="p-4 font-mono text-xs">Latency (RTT)</td>
                    <td className="p-4 text-green-500">&lt; 100ms</td>
                    <td className="p-4 text-yellow-500">&gt; 300ms</td>
                    <td className={`p-4 ${theme.muted}`}>Verify ISP uplink stability.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
              <Network size={18} />
              Protocol Compliance
            </h2>
            <div className="space-y-4">
              <p className={`leading-relaxed ${theme.muted}`}>
                The current network epoch is <strong>South Era (v0.8 Reinheim)</strong>. Nodes must support glob pattern searches to receive routing rewards.
              </p>
              
              <div className={`p-4 rounded border text-sm ${theme.callout}`}>
                <strong className="block mb-1 font-medium">Verification Step</strong>
                Navigate to the Node Detail view and check the <strong>Configuration</strong> tab. Ensure the Protocol version is listed as <span className="font-mono">v0.8</span>.
              </div>

              <p className={`text-sm ${theme.muted} mt-4`}>
                This update introduces the recursive <code className={`px-1 py-0.5 rounded text-xs font-mono border ${theme.code}`}>find</code> operation, allowing clients to query directory structures using wildcards (e.g., <code className={`px-1 py-0.5 rounded text-xs font-mono border ${theme.code}`}>*.log</code>). Older clients will reject these packets.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-medium mb-6 flex items-center gap-2">
              <Shield size={18} />
              Privacy Configuration
            </h2>
            <div className="space-y-6">
              <p className={`leading-relaxed ${theme.muted}`}>
                XPLORER respects operator anonymity settings defined in the node's local config file.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className={`p-5 rounded-lg border ${theme.border} ${theme.bg}`}>
                   <h3 className="font-medium mb-2">Public Nodes</h3>
                   <p className={`text-sm mb-4 ${theme.muted}`}>
                     Nodes with a public IP address broadcast their geospatial coordinates to the DHT. These are visualized on the Global Map.
                   </p>
                   <div className="text-xs font-mono opacity-50">Flag: public_ip_enabled=true</div>
                </div>

                <div className={`p-5 rounded-lg border ${theme.border} ${theme.bg}`}>
                   <h3 className="font-medium mb-2">Private Nodes</h3>
                   <p className={`text-sm mb-4 ${theme.muted}`}>
                     Nodes behind NAT or flagged as private are masked. XPLORER suppresses location data to prevent triangulation.
                   </p>
                   <div className="text-xs font-mono opacity-50">Flag: public_ip_enabled=false</div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};