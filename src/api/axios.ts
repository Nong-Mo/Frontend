// axios.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://25a0-118-34-210-44.ngrok-free.app/',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.token = token;
      console.log('요청 헤더에 설정된 토큰:', token);
    } else {
      console.warn('토큰이 없습니다!');
    }

    return config;
  },
  (error) => {
    console.error('요청 인터셉터 에러:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
