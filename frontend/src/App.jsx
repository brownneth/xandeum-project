import React, { useState } from 'react';
import { useNetworkData } from './hooks/useNetworkData';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { NodeExplorer } from './pages/NodeExplorer';
import { NodeDetail } from './pages/NodeDetail';

const App = () => {
  const [activePage, setActivePage] = useState('overview');
  const [isDark, setIsDark] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [mapFocus, setMapFocus] = useState(null);
  
  const { nodes, stats, history, loading, loadMore, hasMore } = useNetworkData();

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setActivePage('detail');
  };

  const handleBack = () => {
    setSelectedNode(null);
    setActivePage('nodes');
  };
  const handleViewOnMap = (node) => {
    if (node.geo) {
      setMapFocus({ 
        lat: node.geo.lat, 
        lng: node.geo.lng, 
        zoom: 4, 
        id: Date.now() 
      });
      setActivePage('overview');
    }
  };

  return (
    <MainLayout 
      activeView={activePage} 
      onViewChange={setActivePage} 
      isDark={isDark} 
      toggleTheme={() => setIsDark(!isDark)}
    >
      {activePage === 'overview' && (
        <Dashboard 
          stats={stats} 
          nodes={nodes} 
          history={history}
          isDark={isDark} 
          onNavigate={setActivePage} 
          mapFocus={mapFocus} 
        />
      )}
      
      {activePage === 'nodes' && (
        <NodeExplorer 
          nodes={nodes} 
          loadMore={loadMore} 
          hasMore={hasMore} 
          loading={loading} 
          isDark={isDark}
          onRowClick={handleNodeClick}
          onNavigate={setActivePage} 
        />
      )}
      
      {activePage === 'detail' && selectedNode && (
        <NodeDetail 
          item={selectedNode} 
          onBack={handleBack} 
          isDark={isDark} 
          onViewOnMap={handleViewOnMap} 
        />
      )}
    </MainLayout>
  );
};

export default App;