const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000';

export const api = {
  getStats: async () => {
    const res = await fetch(`${API_URL}/stats`);
    return res.json();
  },
  getNodes: async (page = 1, limit = 50) => {
    const res = await fetch(`${API_URL}/nodes?page=${page}&limit=${limit}`);
    return res.json();
  },
  getMapNodes: async () => {
    const res = await fetch(`${API_URL}/map-nodes`);
    return res.json();
  },
  
  getHistory: async () => {
    const res = await fetch(`${API_URL}/history`);
    return res.json();
  }
};