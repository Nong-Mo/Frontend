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
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    apiError: '',
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '', apiError: '' })); // 입력 변경 시 오류 메시지 초기화
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ email: '', password: '', apiError: '' });

    // 유효성 검사
    if (!formData.email || !formData.password) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        apiError: '이메일과 비밀번호를 입력해주세요.',
      }));
      return;
    }

    try {
      const response = await axios.post('/auth/signin', formData);

      if (response.status === 200) {
        const { access_token, token_type } = response.data;
        alert(`로그인 성공! Token: ${token_type} ${access_token}`);
        navigate('/library'); // 로그인 성공 시 Library 페이지로 이동
      }
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          apiError: '로그인에 실패했습니다.',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          apiError: '서버와의 통신에 문제가 발생했습니다.',
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
              웰컴 백!
            </h1>
            <p className="text-4xl font-extrabold text-white leading-tight">
              <span className="text-[#246BFD]">로그인</span>을 해주세요.
            </p>
          </div>

          {/* Form */}
          <form className="w-full w-[400px] h-[390px] flex flex-col space-y-3"
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

            <ErrorMessage message={errors.apiError} isApiError={true} />  {/* API 오류 메시지 */}

            <SubmitButton>
              로그인
            </SubmitButton>

            <div className="flex justify-center items-center mt-4 space-x-[10px]">
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

export default SignIn;