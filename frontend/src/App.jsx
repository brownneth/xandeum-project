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
  
  const { nodes, stats, history, loading, loadMore, hasMore } = useNetworkData();

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setActivePage('detail');
  };

  const handleBack = () => {
    setSelectedNode(null);
    setActivePage('nodes');
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
          // REMOVED: onSearch prop
        />
      )}
      
      {activePage === 'detail' && selectedNode && (
        <NodeDetail 
          item={selectedNode} 
          onBack={handleBack} 
          isDark={isDark} 
        />
      )}
    </MainLayout>
  );
};

export default App;