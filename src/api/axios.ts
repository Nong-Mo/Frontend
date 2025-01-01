import axios from 'axios';

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: 'https://6c68-118-34-210-44.ngrok-free.app/',
  timeout: 30000,
});

// Request 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Authorization 헤더 설정
      config.headers['Authorization'] = `Bearer ${token}`;
      // token 헤더 설정 (서버 요구사항)
      config.headers['token'] = token;
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // 401 Unauthorized 에러 처리
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;