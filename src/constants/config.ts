export const API_BASE_URL = 'https://nongmo-a2d.com';

// 다른 환경별 URL이 필요한 경우를 위한 설정
export const getApiUrl = () => {
    if (process.env.NODE_ENV === 'development') {
        return process.env.REACT_APP_API_URL || API_BASE_URL;
    }
    return API_BASE_URL;
};