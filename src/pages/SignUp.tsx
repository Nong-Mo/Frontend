import React, { useState } from 'react';
import FormContainer from '../components/features/SignUp/FormContainer';
import InputField from '../components/features/SignUp/InputField';
import SubmitButton from '../components/features/SignUp/SubmitButton';

const Signup = () => {
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })); // 입력 중 에러 초기화
  };

  const isValidPassword = (password) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nickname, email, password, confirmPassword } = formData;
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

    if (password !== confirmPassword) {
      newErrors.confirmPassword = '비밀번호와 비밀번호 확인이 일치하지 않습니다.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert('회원가입 성공!');
      // TODO: 로그인 페이지로 리다이렉트
    }
  };

  return (
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
              placeholder="닉네임을 입력하세요"
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
              placeholder="8~20자 비밀번호"
              error={errors.password}
          />
          <InputField
              label="비밀번호 확인"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호 재확인"
              error={errors.confirmPassword}
          />
          <SubmitButton className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            회원가입
          </SubmitButton>
        </form>
      </FormContainer>
  );
};

export default Signup;
