export const API_BASE_URL = 'http://127.0.0.1:8000/';

// 다른 환경별 URL이 필요한 경우를 위한 설정
export const getApiUrl = () => {
    if (process.env.NODE_ENV === 'development') {
        return process.env.REACT_APP_API_URL || API_BASE_URL;
    }
    return API_BASE_URL;
};