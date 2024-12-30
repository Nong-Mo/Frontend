import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/features/Sign/FormContainer';
import InputField from '../components/features/Sign/InputField';
import SubmitButton from '../components/features/Sign/SubmitButton';

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
    });

    const navigate = useNavigate();

    const isValidPassword = (password) => {
        const lengthCheck = password.length >= 8 && password.length <= 20;
        const spaceCheck = !/\s/.test(password);
        const types = [
            /[A-Z]/.test(password), // 대문자
            /[a-z]/.test(password), // 소문자
            /[0-9]/.test(password), // 숫자
            /[!@#$%^&*(),.?":{}|<>]/.test(password), // 특수문자
        ];
        const typeCount = types.filter(Boolean).length;

        return lengthCheck && spaceCheck && typeCount >= 3; // 최소 3종류 포함
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));

        let error = '';
        if (name === 'email' && !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)) {
            error = '유효한 이메일 주소를 입력해주세요.';
        }
        if (name === 'password' && !isValidPassword(value)) {
            error = '비밀번호는 8~20자 사이여야 하며, 공백 없이 두 종류 이상의 문자를 포함해야 합니다.';
        }
        if (name === 'password_confirmation' && value !== formData.password) {
            error = '비밀번호와 비밀번호 확인이 일치하지 않습니다.';
        }

        setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { nickname, email, password, password_confirmation } = formData;
        const newErrors = {};

        if (nickname.length < 3) {
            newErrors.nickname = '닉네임은 3자 이상이어야 합니다.';
        }

        if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
            newErrors.email = '유효한 이메일 주소를 입력해주세요.';
        }

        if (!isValidPassword(password)) {
            newErrors.password =
                '비밀번호는 8~20자 사이여야 하며, 공백 없이 두 종류 이상의 문자를 포함해야 합니다.';
        }

        if (password !== password_confirmation) {
            newErrors.password_confirmation = '비밀번호와 비밀번호 확인이 일치하지 않습니다.';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const response = await axios.post('https://e6be-118-34-210-78.ngrok-free.app/auth/signup', {
                    email: email,
                    nickname: nickname,
                    password: password,
                    password_confirmation: password_confirmation,
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
        <div className="page-container">
            <FormContainer inputRoundClass="rounded-lg" buttonRoundClass="rounded-full">
                <div className="mb-6 text-left">
                    <h1 className="text-3xl font-extrabold text-gray-800">
                        환영합니다! 🤗
                    </h1>
                    <h1 className="text-3xl font-extrabold text-gray-800">회원가입을 해볼까요?</h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField
                        label="닉네임"
                        type="text"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleChange}
                        placeholder="닉네임을 입력하세요."
                        error={errors.nickname}
                    />
                    <InputField
                        label="이메일"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@domain.com"
                        error={errors.email}
                    />
                    <InputField
                        label="비밀번호"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="8~20자 비밀번호를 입력하세요."
                        error={errors.password}
                    />
                    <InputField
                        label="비밀번호 확인"
                        type="password"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        placeholder="비밀번호를 한 번 더 입력하세요."
                        error={errors.password_confirmation}
                    />
                    {errors.apiError && <p className="text-red-500 text-xs mt-1">{errors.apiError}</p>}
                    <SubmitButton className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                        회원가입
                    </SubmitButton>
                </form>
            </FormContainer>
        </div>
    );
};

export default Signup;