import React from 'react';
import { ArrowLeft, CheckCircle, HelpCircle, Shield, Globe, HardDrive, Activity, Wifi, FileText } from 'lucide-react';

export const UserGuide = ({ onBack, isDark }) => {
  const theme = isDark 
    ? { 
        bg: 'bg-[#161616]', text: 'text-[#f4f4f4]', 
        card: 'bg-[#262626]', border: 'border-[#393939]', 
        subText: 'text-gray-400',
        code: 'bg-[#161616] border-[#333]',
        success: 'text-[#42be65]', critical: 'text-[#fa4d56]', warn: 'text-[#f1c21b]',
        heading: 'text-white'
      }
    : { 
        bg: 'bg-[#f4f4f4]', text: 'text-[#161616]', 
        card: 'bg-white', border: 'border-gray-200', 
        subText: 'text-gray-600',
        code: 'bg-gray-100 border-gray-300',
        success: 'text-[#24a148]', critical: 'text-[#da1e28]', warn: 'text-[#b28600]',
        heading: 'text-gray-900'
      };

  return (
    <div className={`animate-fade-in max-w-5xl mx-auto pb-20 ${theme.text}`}>
            <div className="mb-10 pt-4 border-b border-dashed border-gray-700 pb-8">
        <button 
          onClick={onBack} 
          className={`flex items-center gap-2 px-4 py-2 text-xs font-normal rounded-lg transition-all border mb-6 ${isDark ? 'border-transparent hover:bg-[#353535]' : 'border-transparent hover:bg-gray-200'}`}
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </button>
        <h1 className="text-4xl font-light mb-3">Operator Manual</h1>
        <p className="text-xl opacity-60 font-light max-w-2xl">
          Diagnostics, troubleshooting, and protocol specifications for the v0.8 Reinheim Network.
        </p>
      </div>

      <div className="space-y-16">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Activity className={theme.success} size={24} />
            <h2 className="text-2xl font-light">Diagnostic Reference</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-lg border ${theme.card} ${theme.border} flex flex-col`}>
              <div className="flex items-center gap-2 mb-4 text-blue-400">
                <HardDrive size={18} />
                <h3 className="font-medium text-sm uppercase tracking-wide">Storage Load</h3>
              </div>
              <p className={`text-sm mb-4 flex-1 ${theme.subText}`}>
                Ratio of Used vs. Committed capacity.
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
                Ingress/Egress gossip traffic heartbeat.
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
        <section className="space-y-12">
            
            <div className="flex items-center gap-3 mb-6 border-t border-dashed border-gray-700 pt-10">
                <FileText className={theme.subText} size={24} />
                <h2 className="text-2xl font-light">Detailed Documentation</h2>
            </div>
            <div className="grid md:grid-cols-[250px_1fr] gap-8">
                <div className={theme.subText}>
                    <h3 className={`text-lg font-medium mb-2 ${theme.heading}`}>v0.8 Reinheim Compliance</h3>
                    <p className="text-sm">Why specific versions matter for node rewards.</p>
                </div>
                <div className="space-y-4 text-sm leading-relaxed opacity-90 max-w-2xl">
                    <p>
                        To participate in the current network era, your node must be synchronized with the <strong>v0.8 Reinheim</strong> update. 
                        You can verify this in the <em>Configuration Tab</em> of your Node Detail page.
                    </p>
                    <p>
                        This protocol version confirms your node supports <strong>directory tree name searching</strong> via glob patterns 
                        (e.g., <code>*.txt</code>). If your node is running an older version, it will reject the new <code>find</code> operations 
                        broadcast by the network, resulting in a lower reputation score.
                    </p>
                </div>
            </div>
            <div className="grid md:grid-cols-[250px_1fr] gap-8">
                <div className={theme.subText}>
                    <h3 className={`text-lg font-medium mb-2 ${theme.heading}`}>Privacy & Geospatial Data</h3>
                    <p className="text-sm">How XPLORER handles IP masking.</p>
                </div>
                <div className="space-y-4 text-sm leading-relaxed opacity-90 max-w-2xl">
                    <p>
                        XPLORER visually distinguishes between node types to help operators verify their configuration anonymity.
                    </p>
                    <ul className="space-y-3 mt-2">
                        <li className="flex gap-3">
                            <Globe size={16} className="mt-1 text-blue-500 shrink-0" />
                            <span>
                                <strong>Public Nodes:</strong> If you configure a Public IP, your node appears on the Global Map. 
                                Use the <span className="text-xs uppercase border px-1 rounded mx-1">View on Map</span> button 
                                to identify your regional cluster and neighbor redundancy.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <Shield size={16} className="mt-1 text-purple-500 shrink-0" />
                            <span>
                                <strong>Private Nodes:</strong> Nodes configured as <code>Private</code> or using non-public IPs 
                                are automatically masked. XPLORER hides the geospatial coordinates to prevent physical triangulation.
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="grid md:grid-cols-[250px_1fr] gap-8">
                <div className={theme.subText}>
                    <h3 className={`text-lg font-medium mb-2 ${theme.heading}`}>Storage Architecture</h3>
                    <p className="text-sm">Committed vs. Used explained.</p>
                </div>
                <div className="space-y-4 text-sm leading-relaxed opacity-90 max-w-2xl">
                    <p>
                        <strong>Committed Capacity</strong> acts as your "Credit Limit." It is the total physical space you have 
                        cryptographically pledged to the Xandeum chain.
                    </p>
                    <p>
                        <strong>Used Storage</strong> is the "Current Balance." It represents actual client shards stored on disk. 
                        It is normal for this to be low in early network phases. However, if Used Storage approaches Committed Capacity (&gt;90%), 
                        your node will stop accepting new write requests until you add more physical drives and update your pledge.
                    </p>
                </div>
            </div>


        </section>

      </div>
    </div>
  );
};