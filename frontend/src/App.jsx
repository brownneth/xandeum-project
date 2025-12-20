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
  const handleManualNavigation = (page) => {
    setMapFocus(null); 
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setActivePage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToExplorer = () => {
    setSelectedNode(null);
    setActivePage('nodes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      onViewChange={handleManualNavigation} 
      isDark={isDark} 
      toggleTheme={() => setIsDark(!isDark)}
    >
      {activePage === 'overview' && (
        <Dashboard 
          stats={stats} 
          nodes={nodes} 
          history={history}
          isDark={isDark} 
          onNavigate={handleManualNavigation} 
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
          onNavigate={handleManualNavigation}
        />
      )}
      
      {activePage === 'detail' && selectedNode && (
        <NodeDetail 
          item={selectedNode} 
          onBack={handleBackToExplorer} 
          isDark={isDark} 
          onViewOnMap={handleViewOnMap} 
        />
      )}
    </MainLayout>
  );
};

export default App;