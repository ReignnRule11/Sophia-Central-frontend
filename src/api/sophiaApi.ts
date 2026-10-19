export const sophiaApi = {
  auth: {
    login: async (payload: { email: string; password: string }) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, { method: 'POST', headers: JSON_HEADERS, body: JSON.stringify(payload) });
      return response.json();
    },
    register: async (payload: Record<string, unknown>) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, { method: 'POST', headers: JSON_HEADERS, body: JSON.stringify(payload) });
      return response.json();
    },
  },
  resources: {
    list: async () => {
      const response = await fetch(`${API_BASE_URL}/resources`, { headers: authHeaders() });
      const data = await response.json();
      return Array.isArray(data) ? data : data?.data || [];
    },
    create: async (payload: Record<string, unknown>) => {
      const response = await fetch(`${API_BASE_URL}/resources`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(payload) });
      return response.json();
    },
    byId: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/resources/${id}`, { headers: authHeaders() });
      return response.json();
    },
  },
  courses: {
    list: async () => {
      const response = await fetch(`${API_BASE_URL}/courses`, { headers: authHeaders() });
      return response.json();
    },
  },
  institutions: {
    list: async () => {
      const response = await fetch(`${API_BASE_URL}/institutions`, { headers: authHeaders() });
      return response.json();
    },
  },
  ai: {
    ask: async (payload: { question: string; resourceId?: string }) => {
      const response = await fetch(`${API_BASE_URL}/ai/ask`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(payload) });
      return response.json();
    },
  },
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const JSON_HEADERS = { 'Content-Type': 'application/json' };

function authHeaders() {
  const token = localStorage.getItem('sophia-auth-token');
  return {
    ...JSON_HEADERS,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
