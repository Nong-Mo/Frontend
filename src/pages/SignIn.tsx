import React, { useState, ChangeEvent, FormEvent } from 'react';
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
    
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    let error = '';
    if (name === 'email' && !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)) {
      error = '유효한 이메일 주소를 입력해주세요.';
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = formData;
    const newErrors: { [key: string]: string } = {};

    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post('https://e6be-118-34-210-78.ngrok-free.app/auth/signin', { email, password });
        if (response.status === 200) {
          const { access_token, token_type } = response.data;
          alert('로그인에 성공했습니다!');
          // Store the token if needed
          // localStorage.setItem('token', `${token_type} ${access_token}`);
          navigate('/dashboard');
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            apiError: '로그인에 실패했습니다.',
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            apiError: '서버 오류가 발생했습니다. 다시 시도해주세요.',
          }));
        }
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
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
                placeholder="비밀번호를 입력하세요."
                error={errors.password}
            />
            {errors.apiError && (
                <p className="text-red-500 text-xs mt-1">{errors.apiError}</p>
            )}
            <SubmitButton
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              로그인
            </SubmitButton>
          </form>
        </FormContainer>
      </div>
  );
};

export default SignIn;