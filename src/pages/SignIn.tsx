import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/features/Sign/InputField';
import ErrorMessage from '../components/features/Sign/ErrorMessage';
import SubmitButton from '../components/features/Sign/SubmitButton';
import PasswordToggleButton from '../components/features/Sign/PasswordToggleButton';

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.email || !formData.password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post('/auth/signin', formData);

      if (response.status === 200) {
        const { access_token, token_type } = response.data;
        alert(`로그인 성공! Token: ${token_type} ${access_token}`);
        navigate('/home'); // Redirect to home page on success
      }
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setError('로그인에 실패했습니다.');
      } else {
        setError('서버와의 통신에 문제가 발생했습니다.');
      }
    }
  };

  return (
      <div className="z-10 w-full flex items-start justify-center min-h-screen bg-gray-900 text-white">
        <div className="w-[400px] p-8 mt-[124px]">
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
          <form className="w-full w-[400px] h-[390px] flex justify-between flex-col" onSubmit={handleSubmit}>
            {/* Email Input */}
            <InputField
                label="이메일"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="이메일을 입력하세요."
            />

            {/* Password Input */}
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

            {/* Error Message */}
            <ErrorMessage message={error} />

            {/* Submit Button */}
            <SubmitButton>
              로그인
            </SubmitButton>

            {/* Signup Link */}
            <div className="flex justify-center items-center mt-4 space-x-[10px]">
              <span className="text-[#FFFFFF] text-[12px] font-medium">계정이 없으신가요? </span>
              <a
                  href="/signup"
                  className="text-[#FFFFFF] text-[12px] font-bold hover:text-blue-500 transition-all"
              >
                회원가입
              </a>
            </div>
          </form>
        </div>
      </div>
  );
};

export default SignIn;