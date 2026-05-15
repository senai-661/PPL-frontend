import axios from 'axios';
import { SERVER_CFG } from '../appConfig';

const api = axios.create({
  baseURL: SERVER_CFG.SERVER_URL,
});

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      // eslint-disable-next-line no-param-reassign
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore (e.g., server-side or restricted env)
  }
  return config;
});

export default api;
