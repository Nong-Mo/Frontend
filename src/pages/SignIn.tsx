import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
      <div className="w-full flex items-start justify-center min-h-screen bg-gray-900 text-white">
        <div className="w-[400px] p-8">
          {/* Header */}
          <div className="mb-8 text-left">
            <h1 className="text-4xl font-extrabold text-white leading-tight">
              웰컴 백!
            </h1>
            <p className="text-4xl font-extrabold text-white leading-tight">
              <span className="text-blue-500">로그인</span>을 해주세요.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="relative">
              <label htmlFor="email" className="block text-sm text-gray-400 mb-1">
                이메일
              </label>
              <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="example@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-500 bg-transparent text-white focus:outline-none focus:border-blue-500 p-0 placeholder:text-gray-500"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <label htmlFor="password" className="block text-sm text-gray-400 mb-1">
                비밀번호
              </label>
              <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="비밀번호를 입력하세요."
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-500 bg-transparent text-white focus:outline-none focus:border-blue-500 p-0 placeholder:text-gray-500"
              />
              <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-full font-semibold text-lg hover:bg-blue-600 transition-all"
            >
              로그인
            </button>

            {/* Signup Link */}
            <div className="text-center mt-4">
              <span className="text-gray-400">계정이 없으신가요? </span>
              <a
                  href="/signup"
                  className="text-white font-semibold hover:text-blue-500 transition-all"
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
