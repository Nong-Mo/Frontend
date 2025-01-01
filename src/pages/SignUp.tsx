import React, { useState } from 'react';
import InputField from '../components/features/Sign/InputField';
import ErrorMessage from '../components/features/Sign/ErrorMessage';
import SubmitButton from '../components/features/Sign/SubmitButton';
import PasswordToggleButton from '../components/features/Sign/PasswordToggleButton';
import { NavBar } from '../components/common/NavBar';
import useAuth from '../hooks/useAuth';
import { SignUp } from '../types/auth';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<SignUp>({
    email: '',
    nickname: '',
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const { loading, errors, handleSignUp, clearErrors } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearErrors();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSignUp(formData);
  };

    return (
        <div className="z-10 w-full flex items-start justify-center min-h-screen bg-gray-900 text-white">
            <div className="fixed top-0 left-0 right-0 z-50">
                <NavBar title="회원가입" showMenu={false}/>
            </div>
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