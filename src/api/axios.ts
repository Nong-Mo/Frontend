import axios from 'axios';

// axios를 사용하여 API 통신을 위한 설정하는 코드

// 기본 axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL: 'https://nongmo-a2d.com/',
    timeout: 30000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

// 모든 요청이 보내지기 전에 실행됨
// 인증이 필요한 API 호출에 자동으로 토큰을 포함함
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // config.headers['Authorization'] = `Bearer ${token}`;
            config.headers['token'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 모든 응답을 처리하기 전에 실행됨
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        }

        if (error.response?.data?.detail) {
            const apiError = error.response.data.detail[0]?.msg;
            return Promise.reject(new Error(apiError || '알 수 없는 오류가 발생했습니다.'));
        }

        return Promise.reject(error);
    }
);

// 파일 업로드용 별도 인스턴스
export const uploadInstance = axios.create({
    baseURL: axiosInstance.defaults.baseURL, // baseURL 상속
    timeout: 120000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data', // 명시적으로 설정
    },
});

uploadInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['token'] = `${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
