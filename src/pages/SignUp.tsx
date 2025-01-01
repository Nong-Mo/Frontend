import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/features/Sign/InputField';
import SubmitButton from '../components/features/Sign/SubmitButton';
import PasswordToggleButton from '../components/features/Sign/PasswordToggleButton';
import ErrorMessage from '../components/features/Sign/ErrorMessage';

const Signup = () => {
    const [formData, setFormData] = useState({
        nickname: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [errors, setErrors] = useState({
        nickname: '',
        email: '',
        password: '',
        password_confirmation: '',
        apiError: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const navigate = useNavigate();

    const isValidPassword = (password: string) => {
        const lengthCheck = password.length >= 8 && password.length <= 20;
        const spaceCheck = !/\s/.test(password);
        const types = [
            /[A-Z]/.test(password), // 대문자 검사
            /[a-z]/.test(password), // 소문자 검사
            /[0-9]/.test(password), // 숫자 검사
            /[!@#$%^&*(),.?":{}|<>]/.test(password), // 특수 문자 검사
        ];
        const typeCount = types.filter(Boolean).length;

        return lengthCheck && spaceCheck && typeCount >= 3;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));

        let error = '';
        if (value === '') {
            error = '';
        } else {
            if (name === 'email' && !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)) {
                error = '유효한 이메일 주소를 입력해주세요.';
            }
            if (name === 'password' && !isValidPassword(value)) {
                error = '비밀번호는 8~20자 사이여야 하며, 공백 없이 세 종류 이상의 문자를 포함해야 합니다.';
            }
            if (name === 'password_confirmation' && value !== formData.password) {
                error = '비밀번호와 비밀번호 확인이 일치하지 않습니다.';
            }
        }

        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { nickname, email, password, password_confirmation } = formData;
        const newErrors = { ...errors };

        if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
            newErrors.email = '유효한 이메일 주소를 입력해주세요.';
        }

        if (!isValidPassword(password)) {
            newErrors.password = '비밀번호는 8~20자 사이여야 하며, 공백 없이 세 종류 이상의 문자를 포함해야 합니다.';
        }

        if (password !== password_confirmation) {
            newErrors.password_confirmation = '비밀번호와 비밀번호 확인이 일치하지 않습니다.';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).every((key) => newErrors[key] === '')) {
            try {
                const response = await axios.post('https://e6be-118-34-210-78.ngrok-free.app/auth/signup', {
                    email,
                    nickname,
                    password,
                    password_confirmation,
                });
                if (response.status === 201) {
                    alert('회원가입에 성공했습니다.');
                    navigate('/login');
                }
            } catch (error) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    apiError: '회원가입에 실패했습니다.',
                }));
            }
        }
    };

    return (
        <div className="z-10 w-full flex items-start justify-center min-h-screen bg-gray-900 text-white">
            <div className="w-[400px] p-8 mt-[124px]">
                {/* Header */}
                <div className="mb-[53px] mb-8 text-left">
                    <h1 className="text-4xl font-extrabold text-white leading-tight">
                        환영합니다!
                    </h1>
                    <p className="text-4xl font-extrabold text-white leading-tight">
                        <span className="text-[#246BFD]">회원가입</span>을 해주세요.
                    </p>
                </div>

                {/* Form */}
                <form className="w-full w-[400px] h-[512px] flex justify-between flex-col space-y-3"
                      onSubmit={handleSubmit}>
                    <div className="relative">
                        <InputField
                            label="닉네임"
                            type="text"
                            name="nickname"
                            autoComplete="off"
                            value={formData.nickname}
                            onChange={handleChange}
                            placeholder="닉네임을 입력하세요."
                            validationError={errors.nickname}
                        />
                    </div>
                    <div className="relative">
                        <InputField
                            label="이메일"
                            type="email"
                            name="email"
                            autoComplete="off"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="이메일을 입력하세요."
                            validationError={errors.email}
                        />
                    </div>
                    <div className="relative">
                        <InputField
                            label="비밀번호"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="비밀번호를 입력하세요."
                            validationError={errors.password}
                        />
                        <PasswordToggleButton
                            showPassword={showPassword}
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    </div>
                    <div className="relative">
                        <InputField
                            label="비밀번호 확인"
                            type={showPasswordConfirmation ? "text" : "password"}
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            placeholder="비밀번호를 한 번 더 입력하세요."
                            validationError={errors.password_confirmation}
                        />
                        <PasswordToggleButton
                            showPassword={showPasswordConfirmation}
                            onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                        />
                    </div>
                    <ErrorMessage message={errors.apiError} isApiError={true}/> {/* API 오류 메시지 */}
                    <SubmitButton>회원가입</SubmitButton>
                </form>
            </div>
        </div>
    );
};

export default Signup;