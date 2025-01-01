import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signUp, signIn } from '../api/auth';
import { SignUp, SignIn, AuthError } from '../types/auth';

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<AuthError>({});
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && ['/signin', '/signup'].includes(location.pathname)) {
      navigate('/home');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  const isValidPassword = (password: string) => {
    const lengthCheck = password.length >= 8 && password.length <= 20;
    const spaceCheck = !/\s/.test(password);
    const types = [
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[!@#$%^&*(),.?":{}|<>]/.test(password),
    ];
    const typeCount = types.filter(Boolean).length;
    return lengthCheck && spaceCheck && typeCount >= 3;
  };

  const validateForm = (data: SignUp | SignIn): boolean => {
    const newErrors: AuthError = {};

    if ('email' in data && !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(data.email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요.';
    }

    if ('password' in data && !isValidPassword(data.password)) {
      newErrors.password = '비밀번호는 8~20자 사이여야 하며, 공백 없이 세 종류 이상의 문자를 포함해야 합니다.';
    }

    if ('password_confirmation' in data && data.password !== data.password_confirmation) {
      newErrors.password_confirmation = '비밀번호와 비밀번호 확인이 일치하지 않습니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (userData: SignUp) => {
    if (!validateForm(userData)) return;

    try {
      setLoading(true);
      await signUp(userData);
      alert('회원가입에 성공했습니다.');
      navigate('/signin');
    } catch (error: any) {
      if (error.response?.status === 400) {
        setErrors({ apiError: error.response.data.detail || '회원가입에 실패했습니다.' });
      } else {
        setErrors({ apiError: '회원가입에 실패했습니다.' });
      }
      console.error('회원가입 에러:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (loginData: SignIn) => {
    if (!validateForm(loginData)) return;
  
    try {
      setLoading(true);
      const data = await signIn(loginData);
      // 서버 응답 구조에 맞게 수정
      localStorage.setItem('token', data.token); // 실제 토큰 필드명으로 수정
      setIsAuthenticated(true);
      alert('환영합니다!');
      navigate('/home');
    } catch (error: any) {
      if (error.response?.status === 401) {
        setErrors({ apiError: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      } else {
        setErrors({ apiError: '로그인에 실패했습니다.' });
      }
      console.error('로그인 에러:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/signin');
  };

  const clearErrors = () => setErrors({});

  return {
    loading,
    errors,
    isAuthenticated,
    handleSignUp,
    handleSignIn,
    logout,
    clearErrors,
  };
};

export default useAuth;