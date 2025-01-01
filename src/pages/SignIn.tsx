import React, { useState } from 'react';
import InputField from '../components/features/Sign/InputField';
import ErrorMessage from '../components/features/Sign/ErrorMessage';
import SubmitButton from '../components/features/Sign/SubmitButton';
import PasswordToggleButton from '../components/features/Sign/PasswordToggleButton';
import { NavBar } from '../components/common/NavBar';
import useAuth from '../hooks/useAuth';
import { SignIn } from '../types/auth';

const Signin: React.FC = () => {
  const [formData, setFormData] = useState<SignIn>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { loading, errors, handleSignIn, clearErrors } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearErrors();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSignIn(formData);
  };
  
  return (
      <div className="page-container flex flex-col items-center justify-center h-[956px] pl-10 pr-10 z-10">
        <div className="fixed top-0 left-0 right-0 z-50">
          <NavBar title="로그인" showMenu={false}/>
        </div>
        <div className="w-[400px] p-8">
          {/* Header */}
          <div className="mb-[53px] mb-8 text-left">
            <h1 className="text-4xl font-extrabold text-white leading-tight">
              웰컴 백!
            </h1>
            <p className="text-4xl font-extrabold text-white leading-tight">
              <span className="text-[#246BFD]">로그인</span>을 해주세요.
            </p>
          </div>

          {/* Form */}
          <form className="w-full w-[400px] flex flex-col gap-2"
              onSubmit={handleSubmit}>
            <div className="relative">
              <InputField
                label="이메일"
                type="email"
                name="email"
                autoComplete="off"
                value={formData.email}
                onChange={handleChange}
                placeholder="이메일을 입력하세요."
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
              />
              <PasswordToggleButton
                showPassword={showPassword}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>

            <ErrorMessage message={errors.apiError} isApiError={true} />

            <SubmitButton>
              로그인
            </SubmitButton>

            <div className="flex justify-center items-center space-x-[10px] mt-[40px]">  {/* gap 대신 직접 마진 적용 */}
              <span className="text-[#FFFFFF] text-[14px] font-base">계정이 없으신가요? </span>
              <a
                href="/signup"
                className="text-[#FFFFFF] text-[14px] font-extrabold hover:text-blue-500 transition-all"
                style={{fontWeight: '1500'}}
              >
                회원가입
              </a>
            </div>
          </form>
        </div>
      </div>
  );
};

export default Signin;