import axios from 'axios';
import { API_BASE_URL } from '../config/env';
import { getToken, clearToken } from './tokenStorage';

export const apiClient = axios.create({
  baseURL: API_BASE_URL.replace(/\/$/, ''),
  timeout: 15000,
});

if (__DEV__) {
  // eslint-disable-next-line no-console
  console.log('[API] Base URL:', apiClient.defaults.baseURL);
}

apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (__DEV__) {
      console.log('[API] Token from storage:', token ? '✓ Present' : '✗ Missing');
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      if (__DEV__) {
        console.log('[API] Auth header added');
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        '[API] Request failed',
        error.response.status,
        error.response.data
      );
      if (error.response.status === 401) {
        clearToken().catch(() => {});
      }
    } else {
      console.error('[API] Request error', error.message);
    }
    return Promise.reject(error);
  }
);

