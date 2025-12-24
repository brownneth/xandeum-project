import React from 'react';
import { ArrowLeft, BookOpen, Shield, Database, Activity, Map, Search } from 'lucide-react';

export const UserGuide = ({ onBack, isDark }) => {
  const theme = isDark 
    ? { bg: 'bg-[#161616]', text: 'text-[#f4f4f4]', card: 'bg-[#262626]', border: 'border-[#393939]', accent: 'text-blue-400' }
    : { bg: 'bg-[#f4f4f4]', text: 'text-[#161616]', card: 'bg-white', border: 'border-gray-200', accent: 'text-blue-600' };

  return (
    <div className={`animate-fade-in max-w-4xl mx-auto pb-12 ${theme.text}`}>
      
      <div className="mb-8 pt-4">
        <button 
          onClick={onBack} 
          className={`flex items-center gap-2 px-4 py-2 text-xs font-normal rounded-lg transition-all border mb-6 ${isDark ? 'border-transparent hover:bg-[#353535]' : 'border-transparent hover:bg-gray-200'}`}
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </button>
        <h1 className="text-4xl font-light mb-2">Operator Manual</h1>
        <p className="text-xl opacity-60 font-light">Technical documentation for XPLORER and the v0.8 Reinheim Network.</p>
      </div>

      <div className="space-y-12">

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Activity className={theme.accent} size={24} />
            <h2 className="text-2xl font-normal">1. Network Specifications</h2>
          </div>
          <div className={`p-6 rounded-lg border ${theme.card} ${theme.border} space-y-4`}>
            <p className="leading-relaxed opacity-80">
              XPLORER is calibrated for the <strong>South Era (v0.8 Reinheim)</strong> release of the Xandeum network. This version introduces critical storage layer capabilities that this dashboard monitors.
            </p>
            <div className="pl-4 border-l-2 border-blue-500 space-y-2">
              <h3 className="font-medium">Protocol Compliance</h3>
              <p className="text-sm opacity-70">
                Nodes displayed on this dashboard are validated against the v0.8 spec. This ensures they support <strong>directory tree name searching</strong> via glob patterns (e.g., <code>*.txt</code> or <code>financials200?.*</code>).
              </p>
              <p className="text-sm opacity-70">
                The dashboard confirms that a node can accept the <code>find</code> operation and perform recursive subdirectory traversal, which is the primary feature advancement of the Reinheim release.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Map className={theme.accent} size={24} />
            <h2 className="text-2xl font-normal">2. Geospatial Monitoring</h2>
          </div>
          <div className={`p-6 rounded-lg border ${theme.card} ${theme.border} space-y-6`}>
            <div>
              <h3 className="text-lg font-medium mb-2">Understanding Node Status</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="w-3 h-3 rounded-full bg-green-500 mt-1 shrink-0"></span>
                  <div>
                    <strong className="block">Active (Public)</strong>
                    <span className="opacity-70">Node is online, reachable via public IP, and has successfully broadcasted its geospatial coordinates.</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="w-3 h-3 rounded-full bg-yellow-400 mt-1 shrink-0"></span>
                  <div>
                    <strong className="block">Resolving</strong>
                    <span className="opacity-70">Node is online but location data is currently being triangulated or is pending DHT propagation.</span>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className={`p-4 rounded border ${isDark ? 'bg-[#1a1a1a] border-[#333]' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2 font-mono text-xs uppercase tracking-wider opacity-50">Feature Focus</div>
              <h4 className="font-medium mb-1">View on Map</h4>
              <p className="text-sm opacity-70">
                In the Node Detail view, clicking <strong>[SCAN EYE] VIEW ON MAP</strong> triggers the global viewport to fly to the node's exact coordinates (Zoom Level 4). This allows operators to visually inspect regional redundancy and neighbor density.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Database className={theme.accent} size={24} />
            <h2 className="text-2xl font-normal">3. Telemetry & Resources</h2>
          </div>
          <div className={`p-6 rounded-lg border ${theme.card} ${theme.border}`}>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium mb-3 border-b pb-2 border-gray-700">Storage Metrics</h3>
                <ul className="space-y-4 text-sm">
                  <li>
                    <strong className="block text-blue-400">Committed Capacity</strong>
                    <span className="opacity-70">The total disk space a pNode has cryptographically pledged to the network. This is the "max capacity" visible to the chain.</span>
                  </li>
                  <li>
                    <strong className="block text-green-400">Used Storage</strong>
                    <span className="opacity-70">Actual data shards currently residing on the disk. High utilization (&gt;90%) indicates a need for capacity expansion.</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-3 border-b pb-2 border-gray-700">Network Activity</h3>
                <ul className="space-y-4 text-sm">
                  <li>
                    <strong className="block">Packets Sent/Received</strong>
                    <span className="opacity-70">Real-time counter of ingress/egress messages. A stagnant counter on an "Online" node may indicate a firewall or configuration issue blocking gossip traffic.</span>
                  </li>
                  <li>
                    <strong className="block">Latency (RTT)</strong>
                    <span className="opacity-70">Average round-trip time to the nearest peer. Optimal performance for v0.8 is &lt;100ms.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-4">
            <Shield className={theme.accent} size={24} />
            <h2 className="text-2xl font-normal">4. Privacy & Anonymity</h2>
          </div>
          <div className={`p-6 rounded-lg border ${theme.card} ${theme.border}`}>
            <p className="mb-4 text-sm opacity-80">
              XPLORER respects the privacy flags set in the pNode configuration.
            </p>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${isDark ? 'bg-purple-900/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                <Shield size={20} />
              </div>
              <div>
                <h3 className="font-medium">Private Node Shielding</h3>
                <p className="text-sm opacity-70 mt-1">
                  If a node is flagged as <code>Private</code> or detects a non-public IP range, XPLORER automatically masks its geospatial data. 
                  The map visualization is disabled for these nodes, and their detail view shows a "Location Data Hidden" state to prevent physical triangulation.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};