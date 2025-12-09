// API INTEGRATION HELPER
// If you need to fix import issues in the frontend

// Option 1: If using axios directly
// Replace imports like:
// import api from '@/api/mediaApi';
// With:
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
});

// Add auth interceptor if using Clerk
api.interceptors.request.use(async (config) => {
  const { getToken } = await import('@clerk/clerk-react');
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { api };

// Option 2: If you have a central API file
// File: client/src/lib/api.ts
// Make sure it exports both named and default:

export { api };
export default api;

// Then in your components, use:
// import { api } from '@/lib/api';
// or
// import api from '@/lib/api';

// Both will work!

// Option 3: Check your existing mediaApi.ts file
// File: client/src/api/mediaApi.ts
// Add at the end:

export default api;  // Add this line if it's missing

// This makes both imports work:
// import api from '@/api/mediaApi';  // default import
// import { api } from '@/api/mediaApi';  // named import
