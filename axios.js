import axios from 'axios';
import store from './store/store';
import { refreshAccessToken, logout } from './slices/authSlice';

// Setting up an Axios instance with a base URL so you don't have to repeatedly specify it
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

// Add a response interceptor to handle token expiration
instance.interceptors.response.use(
  (response) => response, // If the response is successful, return it
  async (error) => {
    const originalRequest = error.config;
    // Check if the error status is 401 (Unauthorized) and the request is not retried yet
    if (error.response?.data.code === 'INVALID_TOKEN' && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log(originalRequest._retry);
      try {
        // Attempt to refresh the token
        await store.dispatch(refreshAccessToken()).unwrap();

        // Retry the original request with the new token
        const newAccessToken = store.getState().auth.accessToken;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout or handle accordingly
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    // If the error is not 401 or the token refresh fails, reject the error
    return Promise.reject(error);
  }
);

export default instance;
