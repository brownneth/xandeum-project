import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';
import { formatStorage } from '../utils/formatters';

export const useNetworkData = () => {
  const [nodes, setNodes] = useState([]);      
  const [mapNodes, setMapNodes] = useState([]); 
  const [stats, setStats] = useState({
    totalNodes: 0,
    onlineNodes: 0,
    totalStorage: '0 GB',
    networkHealth: 0
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const isFetching = useRef(false);

  const fetchGlobalData = async () => {
    try {
      const [statsData, historyData, mapData] = await Promise.all([
        api.getStats(),
        api.getHistory(),
        api.getMapNodes()
      ]);

      setStats({
        totalNodes: statsData.total_nodes,
        onlineNodes: statsData.online_nodes,
        totalStorage: formatStorage(statsData.total_storage_bytes),
        networkHealth: statsData.total_nodes > 0 ? (statsData.online_nodes / statsData.total_nodes) * 100 : 0
      });

      setHistory(historyData);


      const formattedMapNodes = mapData.map((n, i) => ({
        id: `map-node-${i}`,
        fullAddress: n.ip,
        geo: (n.lat && n.lon) ? { lat: n.lat, lng: n.lon } : null
      }));
      setMapNodes(formattedMapNodes);

    } catch (err) {
      console.warn("Failed to fetch global data", err);
    }
  };
  


  const fetchNodes = useCallback(async (pageNum) => {
    try {
      if (nodes.length === 0) setLoading(true);
      
      const rawData = await api.getNodes(pageNum);

      if (!Array.isArray(rawData) || rawData.length === 0) {
        setHasMore(false);
        setLoading(false);
        return;
      }

      const newNodes = rawData.map((n, i) => {
        const baseIp = n.ip_address.split(':')[0];

        const hasBackendGeo = n.lat && n.lon; 

        return {
          ...n,
          id: n.id || `node-${pageNum}-${i}`,
          fullAddress: n.ip_address,
          baseIp: baseIp,

          formattedStorage: formatStorage(n.storage_committed_bytes || 0),
          storage: n.storage_committed_bytes || 0,
          lastSeen: n.last_seen,

          geo: hasBackendGeo ? { lat: n.lat, lng: n.lon } : null,
          location: (n.city && n.country) ? `${n.city}, ${n.country}` : "Resolving..."
        };
      });

      


      setNodes(prev => {
        if (pageNum === 1) return newNodes;
        
        const existingIds = new Set(prev.map(n => n.id));
        const uniqueNew = newNodes.filter(n => !existingIds.has(n.id));
        return [...prev, ...uniqueNew];
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []); 

  useEffect(() => {
    const init = async () => {
        await fetchNodes(1);
        await fetchGlobalData();
    };
    init();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
        if (isFetching.current) return;
        isFetching.current = true;
        await Promise.all([
            fetchNodes(page), 
            fetchGlobalData() 
        ]);
        isFetching.current = false;
    }, 5000); 

    return () => clearInterval(interval);
  }, [page, fetchNodes]); 

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNodes(nextPage);
    }
  };

  return { nodes, mapNodes, stats, history, loading, loadMore, hasMore };
};