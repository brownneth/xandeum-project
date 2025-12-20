const BASE_URL = import.meta.env.VITE_API_URL || '';

export const api = {
  getNodes: async (page = 1, limit = 50) => {
    const response = await fetch(`${BASE_URL}/nodes?page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error('API Response Failed');
    return response.json();
  },

  getStats: async () => {
    const response = await fetch(`${BASE_URL}/stats`);
    if (!response.ok) throw new Error('Stats Fetch Failed');
    return response.json();
  },

  getHistory: async () => {
    const response = await fetch(`${BASE_URL}/history`);
    if (!response.ok) throw new Error('History Fetch Failed');
    return response.json();
  },

  getGeoLocation: async (ip) => {
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    return response.json();
  }
};