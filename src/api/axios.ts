import axios from 'axios';

// axios를 사용하여 API 통신을 위한 설정하는 코드

// 기본 axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: 'https://08f9-118-34-210-62.ngrok-free.app/',
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
    console.log('요청 인터셉터 실행됨'); // 추가
    const token = localStorage.getItem('token');
    console.log('localStorage에서 가져온 토큰:', token); // 추가
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('token 헤더 추가됨:', config.headers['token']); // 추가
    }
    console.log('최종 요청 헤더:', config.headers); // 추가: 전체 헤더 확인
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
    console.log('uploadInstance 요청 인터셉터 실행됨'); // 로그 추가
    const token = localStorage.getItem('token');
    console.log('localStorage에서 가져온 토큰:', token); // 로그 추가
    if (token) {
      config.headers['token'] = `${token}`;
      console.log('uploadInstance token 헤더 추가됨:', config.headers['token']); // 로그 추가
    }
    console.log('uploadInstance 최종 요청 헤더:', config.headers); // 전체 헤더 확인
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;