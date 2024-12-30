import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/features/Sign/FormContainer';
import InputField from '../components/features/Sign/InputField';
import SubmitButton from '../components/features/Sign/SubmitButton';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    apiError: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })); // 입력 중 에러 초기화
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    const newErrors = {};

    // 이메일 형식 검증
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요.';
    }

    // 비밀번호 길이 검증
    if (password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const response = await axios.post('/auth/login', { email, password });
        if (response.status === 200) {
          alert('로그인에 성공했습니다!');
          navigate('/dashboard'); // 로그인 성공 시 대시보드로 이동
        }
      } catch (error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          apiError: '이메일 또는 비밀번호가 잘못되었습니다.',
        }));
      } finally {
        setLoading(false);
      }
    }
  };


  return (
      <div className="page-container">
        <FormContainer>
          <div className="mb-6 text-left">
            <h1 className="text-3xl font-extrabold text-gray-800">
              다시 만나 반가워요! 👋
            </h1>
            <h1 className="text-2xl font-semibold text-gray-600">로그인 해주세요.</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
                label="이메일"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@domain.com"
                error={errors.email}
                disabled={loading}
            />
            <InputField
                label="비밀번호"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요."
                error={errors.password}
                disabled={loading}
            />
            {errors.apiError && (
                <p className="text-red-500 text-xs mt-1">{errors.apiError}</p>
            )}
            <SubmitButton
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                disabled={loading}
            >
              {loading ? '로그인 중...' : '로그인'}
            </SubmitButton>
          </form>
        </FormContainer>
      </div>
  );
};

export default SignIn;
