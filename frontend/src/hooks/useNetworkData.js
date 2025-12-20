import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../services/api';
import { formatStorage } from '../utils/formatters';

export const useNetworkData = () => {
  const [nodes, setNodes] = useState([]);
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

  const geoQueue = useRef([]);
  const isProcessingQueue = useRef(false);

  const fetchGlobalData = async () => {
    try {
      const [statsData, historyData] = await Promise.all([
        api.getStats(),
        api.getHistory()
      ]);

      setStats({
        totalNodes: statsData.total_nodes,
        onlineNodes: statsData.online_nodes,
        totalStorage: formatStorage(statsData.total_storage_bytes),
        networkHealth: statsData.total_nodes > 0 ? (statsData.online_nodes / statsData.total_nodes) * 100 : 0
      });

      setHistory(historyData);
    } catch (err) {
      console.warn("Failed to fetch global data", err);
    }
  };

  const processGeoQueue = async () => {
    if (geoQueue.current.length === 0) {
      isProcessingQueue.current = false;
      return;
    }

    isProcessingQueue.current = true;
    const ip = geoQueue.current.shift();
    const cacheKey = `geo-cache-${ip}`;

    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      try {
        const data = JSON.parse(cachedData);
        setNodes(prevNodes => prevNodes.map(node => 
          node.baseIp === ip ? { ...node, geo: { lat: data.lat, lng: data.lon }, location: `${data.city}, ${data.countryCode}` } : node
        ));
      } catch (e) {
        console.error("Cache parse error", e);
      }
      setTimeout(processGeoQueue, 10); 
    } else {

      try {
        const data = await api.getGeoLocation(ip);
        if (data.status === 'success') {
          localStorage.setItem(cacheKey, JSON.stringify(data));
          setNodes(prevNodes => prevNodes.map(node => 
            node.baseIp === ip ? { ...node, geo: { lat: data.lat, lng: data.lon }, location: `${data.city}, ${data.countryCode}` } : node
          ));
        }
      } catch (err) {
        console.warn(`Geo fetch failed for ${ip}`, err);
      }
      setTimeout(processGeoQueue, 1200); 
    }
  };

  const fetchNodes = useCallback(async (pageNum) => {
    try {
      setLoading(true);
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
          id: n.id || `node-${pageNum}-${i}`,
          fullAddress: n.ip_address,
          baseIp: baseIp,
          version: n.version,
          status: n.status,
          storage: n.storage_committed_bytes || 0,
          formattedStorage: formatStorage(n.storage_committed_bytes || 0),
          lastSeen: n.last_seen,
          
          geo: hasBackendGeo ? { lat: n.lat, lng: n.lon } : null,
          location: (n.city && n.country) ? `${n.city}, ${n.country}` : "Resolving..."
        };
      });

      newNodes.forEach(n => {
        if (!n.geo && !geoQueue.current.includes(n.baseIp)) {
          geoQueue.current.push(n.baseIp);
        }
      });

      if (!isProcessingQueue.current) {
        processGeoQueue();
      }

      setNodes(prev => {
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
    fetchNodes(1);
    fetchGlobalData(); 
  }, [fetchNodes]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNodes(nextPage);
    }
  };

  return { nodes, stats, history, loading, loadMore, hasMore };
};