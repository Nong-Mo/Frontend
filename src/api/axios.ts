import axios from 'axios';
import { API_BASE_URL } from '../constants/config';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    withCredentials: false,
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

export const uploadInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 120000,
    withCredentials: false,
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization, X-Request-With'
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    responseType: 'json',
});

uploadInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers['token'] = token;
        }
        
        // FormData 처리
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
            config.headers['Content-Transfer-Encoding'] = 'multipart/form-data';
            config.transformRequest = [
                (data) => {
                    // FormData를 그대로 반환
                    if (data instanceof FormData) {
                        return data;
                    }
                    // 다른 데이터 타입의 경우 JSON 문자열로 변환
                    return JSON.stringify(data);
                }
            ];
        }
        
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

uploadInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.error('Response Error:', error);

        if (error.response?.status === 401) {
            sessionStorage.removeItem('token');
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
            throw new Error('인증이 필요합니다.');
        }
        
        // 에러 처리 개선
        if (!error.response) {
            // 네트워크 에러
            if (error.message.includes('Network Error')) {
                throw new Error('네트워크 연결을 확인해주세요.');
            }
            // 타임아웃 에러
            if (error.code === 'ECONNABORTED') {
                throw new Error('요청 시간이 초과되었습니다. 파일 크기를 확인하고 다시 시도해주세요.');
            }
        } else {
            // HTTP 상태 코드에 따른 에러 처리
            switch (error.response.status) {
                case 400:
                    throw new Error('잘못된 요청입니다. 입력값을 확인해주세요.');
                case 413:
                    throw new Error('파일이 너무 큽니다. 더 작은 크기의 파일을 업로드해주세요.');
                case 415:
                    throw new Error('지원하지 않는 파일 형식입니다.');
                case 429:
                    throw new Error('너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.');
                case 500:
                    throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                default:
                    throw new Error('알 수 없는 오류가 발생했습니다. 다시 시도해주세요.');
            }
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;