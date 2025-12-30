const API_BASE_URL = 'http://localhost:5000/api';

export const articleAPI = {
  getAll: async (page = 1, limit = 10, enhanced = undefined) => {
    const params = new URLSearchParams({ page, limit });
    if (enhanced !== undefined) params.append('enhanced', enhanced);
    
    const response = await fetch(`${API_BASE_URL}/articles?${params}`);
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`);
    return response.json();
  },

  create: async (data) => {
    const response = await fetch(`${API_BASE_URL}/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  update: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};
