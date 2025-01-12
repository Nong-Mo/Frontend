import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthListener = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleUnauthorized = () => {
      // 현재 경로를 state로 저장하고 로그인 페이지로 리다이렉트
      navigate('/login', {
        state: { from: window.location.pathname },
        replace: true
      });
    };

    // 토큰 만료/갱신 실패 시 이벤트
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [navigate]);
};