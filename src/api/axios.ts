import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'https://25a0-118-34-210-44.ngrok-free.app/',
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
    (config) => {
        console.log('API 요청 전:', config);
        const token = localStorage.getItem('token');
        
        // 토큰 설정 로직을 더 명시적으로 처리
        if (token) {
            // headers가 undefined인 경우를 대비해 빈 객체 할당
            config.headers = config.headers || {};
            config.headers.token = token;
            
            // 디버깅을 위한 로그
            console.log('설정된 토큰:', token);
            console.log('설정된 헤더:', config.headers);
        } else {
            console.warn('토큰이 없습니다!');
        }

        return config;
    },
    (error) => {
        console.error('API 요청 에러:', error);
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        console.log('API 응답:', response);
        return response;
    },
    (error) => {
        console.error('API 응답 에러:', error.response || error);
        return Promise.reject(error);
    }
);

export default axiosInstance;