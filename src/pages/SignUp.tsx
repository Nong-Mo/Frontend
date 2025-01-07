import React, { useState } from "react";
import InputField from "../components/features/Sign/InputField";
import ErrorMessage from "../components/features/Sign/ErrorMessage";
import SubmitButton from "../components/features/Sign/SubmitButton";
import InfoText from "../components/common/InfoText.tsx";
import useAuth from "../hooks/useAuth";
import { NavBar } from "../components/common/NavBar.tsx";
import type { SignUp } from "../types/auth";

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password: string): boolean => {
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

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState<SignUp>({
    email: "",
    password: "",
    password_confirmation: "",
    nickname: ""
  });
  const { errors, handleSignUp, setErrors } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 특정 필드의 에러 초기화
    setErrors((prev) => ({ ...prev, [name]: undefined }));

    // 실시간 유효성 검사
    if (name === "email" && !isValidEmail(value)) {
      setErrors((prev) => ({ ...prev, email: "유효한 이메일 형식이 아닙니다." }));
    } else if (name === "password" && !isValidPassword(value)) {
      setErrors((prev) => ({ ...prev, password: "비밀번호는 8~20자 사이여야 하며, 공백 없이 두 종류 이상의 문자를 포함해 주세요." }));
    } else if (name === "password_confirmation" && value !== formData.password) {
      setErrors((prev) => ({ ...prev, password_confirmation: "비밀번호와 비밀번호 확인이 일치하지 않습니다." }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 폼 유효성 검사
    if (!formData.email || !isValidEmail(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "유효한 이메일 형식이 아닙니다." }));
      return;
    }

    if (!formData.password || formData.password !== formData.password_confirmation) {
      setErrors((prev) => ({
        ...prev,
        password_confirmation: "비밀번호와 비밀번호 확인이 일치하지 않습니다."
      }));
      return;
    }

    if (!isValidPassword(formData.password)) {
      setErrors((prev) => ({
        ...prev,
        password: "비밀번호는 8~20자 사이여야 하며, 공백 없이 두 종류 이상의 문자를 포함해 주세요."
      }));
      return;
    }

    await handleSignUp(formData);
  };

  return (
      <div className="w-full h-[896px] flex flex-col px-[32px] z-10">

        {/* NavBar 영역 */}
        <NavBar
            title="회원가입"
            hideLeftIcon={false}
            showMenu={false}
            iconNames={{
              backIcon: "뒤로가기"
            }}
            rightIcons={[]}
        />
        {/* Contents 영역 */}
        <div className="w-[350px] h-[729px] flex flex-col items-center">
          {/* InfoText 영역 */}
          <div className="w-full primary-info-text">
            <InfoText title="환영합니다!" subtitle={<><span className="info-point-text">회원가입</span> 해주세요.</>}/>
          </div>

          {/* Form 영역 */}
          <div className=" w-full flex flex-col">
            <form className="mt-[65px] w-full h-[405px] justify-between flex flex-col mb-[65px]" onSubmit={handleSubmit}>
              <InputField
                  label="닉네임"
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  placeholder="닉네임을 입력해 주세요."
              />
              <InputField
                  label="이메일"
                  type="email"
                  name="email"
                  autoComplete="off"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="이메일을 입력해 주세요."
                  validationError={errors.email}
              />
              <InputField
                  label="비밀번호"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="비밀번호를 입력해 주세요."
                  validationError={errors.password}
                  showPasswordToggle={true}
              />
              <InputField
                  label="비밀번호 확인"
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  placeholder="비밀번호를 한 번 더 입력해 주세요."
                  validationError={errors.password_confirmation}
                  showPasswordToggle={true}
              />
            </form>

            <div className="h-[14px] mb-[10px]">
              {errors.apiError && <ErrorMessage message={errors.apiError} isApiError={true}/>}
            </div>

            <div>
              <SubmitButton onClick={handleSubmit}>회원가입</SubmitButton>
            </div>
          </div>
        </div>
      </div>
  );
};

export default SignUpPage;