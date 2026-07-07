import axios from 'axios';
import { config } from './config';
import { ACCESS_TOKEN_KEY } from './constants';

export const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Flag to prevent multiple refresh calls if several requests fail at once
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string | null) => void;
  reject: (error: unknown | Error) => void;
}[] = [];

const processQueue = (error: unknown | Error | null, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    return response;
  }, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    // 1. Check if it's a 401 and make sure we aren't already retrying this exact request
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 2. Identify if it is explicitly an EXPIRED token error
      if (error.response.data?.cause === 'AUTH_TOKEN_EXPIRED') {
        if (isRefreshing) {
          // If a refresh is already in progress, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
              return apiClient(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // 3. Call your refresh token endpoint
          const response = await apiClient.post('/user/refresh');

          const { token } = response.data;

          // 4. Save the new tokens
          localStorage.setItem(ACCESS_TOKEN_KEY, token);

          // 5. Update fallback authorization headers
          apiClient.defaults.headers.common['Authorization'] =
            'Bearer ' + token;
          originalRequest.headers['Authorization'] = 'Bearer ' + token;

          processQueue(null, token);
          return apiClient(originalRequest); // Retry the original request
        } catch (refreshError) {
          processQueue(refreshError, null);

          // Refresh token is also expired or invalid -> Logout user
          localStorage.clear();
          window.location.href = '/signin';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // 6. It's a 401 but NOT an expired error (e.g., completely invalid or missing token)
        localStorage.clear();
        window.location.href = '/signin';
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
