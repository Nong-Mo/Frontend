import axios from 'axios';
import { API_BASE_URL } from '../constants/config';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers['token'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            sessionStorage.removeItem('token');
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }
        return Promise.reject(error);
    }
);

// 파일 업로드용 별도 인스턴스
export const uploadInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 120000,
});

uploadInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers['token'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;