import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'https://cf2d-118-34-210-44.ngrok-free.app/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터에 로그 추가
axiosInstance.interceptors.request.use(
    (config) => {
      console.log('API 요청:', config);
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.token = token;
      }
      return config;
    },
    (error) => {
      console.error('API 요청 에러:', error);
      return Promise.reject(error);
    }
  );
  
  // 응답 인터셉터에 로그 추가
  axiosInstance.interceptors.response.use(
    (response) => {
      console.log('API 응답:', response);
      return response;
    },
    (error) => {
      console.error('API 응답 에러:', error);
      return Promise.reject(error);
    }
  );
  
  export default axiosInstance;