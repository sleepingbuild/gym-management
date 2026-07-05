import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Interceptor để gắn token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('ironfit-auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // 🟢 Lấy token từ parsed.state.accessToken
        const token = parsed?.state?.accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.warn('⚠️ Token not found in stored auth data');
        }
      } catch (e) {
        console.error('❌ Error parsing auth data:', e);
      }
    } else {
      console.warn('⚠️ No auth data in localStorage');
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/login')) {
          localStorage.removeItem('ironfit-auth');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;