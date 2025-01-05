import React, { useState } from "react";
import InputField from "../components/features/Sign/InputField";
import ErrorMessage from "../components/features/Sign/ErrorMessage";
import SubmitButton from "../components/features/Sign/SubmitButton";
import InfoText from "../components/features/Sign/InfoText";
import useAuth from "../hooks/useAuth";
import { SignUp } from "../types/auth";

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState<SignUp>({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const { errors, handleSignUp, clearErrors } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearErrors();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSignUp(formData);
  };

  return (
      <div className="page-container flex flex-col items-center h-[956px] pl-10 pr-10 z-10">
        <div className="w-full z-50">
          <InfoText title="환영합니다!" subtitle="회원가입을 해주세요." />
        </div>
        <div className="w-[400px] p-8">
          <form className="w-full flex flex-col gap-2" onSubmit={handleSubmit}>
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
            <InputField
                label="비밀번호"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요."
                validationError={errors.password}
                showPasswordToggle={true}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
            />
            <InputField
                label="비밀번호 확인"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="비밀번호를 다시 입력하세요."
                validationError={errors.confirmPassword}
            />
            {errors.apiError && <ErrorMessage message={errors.apiError} isApiError={true} />}
            <SubmitButton onClick={handleSubmit}>회원가입</SubmitButton>
          </form>
        </div>
      </div>
  );
};

export default SignUpPage;