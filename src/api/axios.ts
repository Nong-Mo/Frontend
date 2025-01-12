import axios from 'axios';
import { getAccessToken, refreshAccessToken, clearTokens } from '../services/tokenService';

const axiosInstance = axios.create({
    baseURL: 'https://nongmo-a2d.com/',
    timeout: 30000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers['token'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newToken = await refreshAccessToken();
                if (newToken) {
                    originalRequest.headers['token'] = newToken;
                    return axiosInstance(originalRequest);
                } else {
                    clearTokens();
                    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
                    return Promise.reject(new Error('토큰 갱신에 실패했습니다.'));
                }
            } catch (refreshError) {
                window.dispatchEvent(new CustomEvent('auth:unauthorized'));
                return Promise.reject(refreshError);
            }
        }

        if (error.response?.data?.detail) {
            return Promise.reject(new Error(error.response.data.detail));
        }

        return Promise.reject(error);
    }
);

// 파일 업로드용 인스턴스
export const uploadInstance = axios.create({
    baseURL: axiosInstance.defaults.baseURL,
    timeout: 120000,
});

uploadInstance.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers['token'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;