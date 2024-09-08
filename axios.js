import axios from 'axios';
import store from './store/store';
import { refreshAccessToken, logout } from './slices/authSlice';

// Setting up an Axios instance with a base URL so you don't have to repeatedly specify it
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

// Attach interceptors to the created Axios instance, not the default Axios object
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Check for 401 status and if the request has not been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      const errorCode = error.response.data.code;

      // Only retry for a specific error code
      if (errorCode === 'INVALID_TOKEN') {
        originalRequest._retry = true;
        try {
          // Use the instance to retry the original request to maintain the base URL and any other configured settings
          await store.dispatch(refreshAccessToken()).unwrap();
          return instance(originalRequest);
        } catch (refreshError) {
          // Token refresh failed, handle it, e.g., by logging out
          store.dispatch(logout());
          return Promise.reject(refreshError);
        }
      } else {
        // For other 401 errors, handle them differently or pass them along
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
