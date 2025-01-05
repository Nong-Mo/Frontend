import React, { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "../components/features/Sign/InputField";
import ErrorMessage from "../components/features/Sign/ErrorMessage";
import SubmitButton from "../components/features/Sign/SubmitButton";
import InfoText from "../components/common/InfoText.tsx";
import useAuth from "../hooks/useAuth";
import { SignIn } from "../types/auth";
import { NavBar } from "../components/common/NavBar.tsx";

const SignInPage: React.FC = () => {
  const [formData, setFormData] = useState<SignIn>({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const { errors, handleSignIn, clearErrors } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearErrors();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSignIn(formData);
  };

  return (
      <div className="w-full h-[896px] flex flex-col px-[32px] z-10">

        {/* NavBar 영역 */}
        <NavBar title="로그인" showMenu={false}/>

        {/* Contents 영역 */}
        <div className="w-[350px] h-[545px] flex flex-col items-center">
          {/* InfoText 영역 */}
          <div className="w-full primary-info-text">
            <InfoText title="환영합니다!" subtitle={<><span className="info-point-text">로그인</span> 해주세요.</>}/>
          </div>

          {/* Form 영역 */}
          <div className="w-full flex flex-col gap-2 ">
            <form className="w-full flex flex-col gap-2 mb-[65px]" onSubmit={handleSubmit}>
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
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
              />
            </form>
            {errors.apiError && <ErrorMessage message={errors.apiError} isApiError={true}/>}
            <div>
              <SubmitButton onClick={handleSubmit}>로그인</SubmitButton>
            </div>
            <div className="w-[350px] text-[12px] text-center font-regular text-[#ffffff] font-['Pretendard']">
              계정이 없으신가요? <Link to="/signup" className="font-semibold">회원가입</Link>
            </div>
          </div>
        </div>
      </div>
  );
};

export default SignInPage;