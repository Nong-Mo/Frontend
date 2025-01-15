import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signUp, signIn, verifyToken } from '../api/auth';
import { SignUp, SignIn, AuthError } from '../types/auth';

const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<AuthError>({});
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!sessionStorage.getItem('token');
    });

    const navigate = useNavigate();
    const location = useLocation();

    // 토큰 유효성 검증
    // const validateStoredToken = async () => {
    //     const token = sessionStorage.getItem('token');
    //     if (!token) {
    //         setIsAuthenticated(false);
    //         return;
    //     }

    //     try {
    //         await verifyToken();
    //         setIsAuthenticated(true);
    //     } catch (error) {
    //         console.error('Token validation error:', error);
    //         sessionStorage.removeItem('token');
    //         setIsAuthenticated(false);
    //         if (location.pathname !== '/signin') {
    //             navigate('/signin', {
    //                 state: { message: '세션이 만료되었습니다. 다시 로그인해주세요.' }
    //             });
    //         }
    //     }
    // };

    // 컴포넌트 마운트 시 토큰 검증
    useEffect(() => {
        // validateStoredToken();
    }, []);

    // 인증 상태 변경 감지 및 리다이렉션
    useEffect(() => {
        if (isAuthenticated && ['/signin', '/signup'].includes(location.pathname)) {
            navigate('/home');
        }
    }, [isAuthenticated, location.pathname, navigate]);

    // 인증 실패 이벤트 처리
    useEffect(() => {
        const handleUnauthorized = () => {
            sessionStorage.removeItem('token');
            setIsAuthenticated(false);
            navigate('/signin', {
                state: { message: '다시 로그인해주세요.' }
            });
        };

        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => {
            window.removeEventListener('auth:unauthorized', handleUnauthorized);
        };
    }, [navigate]);

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

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
        return lengthCheck && spaceCheck && typeCount >= 2;
    };

    const validateForm = (data: SignUp | SignIn): boolean => {
        const newErrors: AuthError = {};

        if ('email' in data && !isValidEmail(data.email)) {
            newErrors.email = '유효한 이메일 주소를 입력해주세요.';
        }

        if ('password' in data && !isValidPassword(data.password)) {
            newErrors.password = '비밀번호는 8~20자 사이여야 하며, 공백 없이 두 종류 이상의 문자를 포함해 주세요.';
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
            navigate('/signin', {
                state: { message: '회원가입이 완료되었습니다. 로그인해주세요.' }
            });
        } catch (error: any) {
            console.error('Signup error:', error);
            if (error.response?.data?.detail) {
                setErrors({
                    apiError: error.response.data.detail
                });
            } else {
                setErrors({ apiError: '회원가입에 실패했습니다.' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSignIn = async (loginData: SignIn) => {
        if (!validateForm(loginData)) return;

        try {
            setLoading(true);
            const response = await signIn(loginData);
            
            if (response?.data?.data?.access_token) {
                const token = response.data.data.access_token;
                sessionStorage.setItem('token', token);
                setIsAuthenticated(true);

                const returnPath = (location.state as any)?.from || '/home';
                navigate(returnPath);
            } else {
                throw new Error('Invalid response structure');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            if (error.response?.status === 401) {
                setErrors({
                    apiError: '이메일 또는 비밀번호가 일치하지 않습니다.'
                });
            } else if (error.response?.data?.detail) {
                setErrors({
                    apiError: error.response.data.detail
                });
            } else {
                setErrors({ apiError: '로그인에 실패했습니다.' });
            }
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        sessionStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/signin');
    };

    return {
        loading,
        errors,
        isAuthenticated,
        handleSignUp,
        handleSignIn,
        logout,
        clearErrors: () => setErrors({}),
        setErrors,
        // validateStoredToken,
    };
};

export default useAuth;