import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import homeImage from "../icons/intro/home.svg";
import SubmitButton from '../components/features/Sign/SubmitButton.tsx';
import LoadingSpinner from "../components/common/LoadingSpinner.tsx";

const Intro: FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="flex flex-col min-h-screen z-10">
      <div className="w-full text-blue-500 flex flex-col items-center mx-auto">
        <div className="w-full relative flex items-center justify-center">
          {isLoading && <LoadingSpinner size="lg" />}
          <div className="w-full h-[458px] overflow-hidden">
            <img
              src={homeImage}
              alt="Home"
              className={`w-[414px] h-[458px] object-cover transition-opacity duration-300 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => setIsLoading(false)}
            />
          </div>
        </div>
        <div className="w-[350px] h-[150px]">
          <h1 className="font-bold text-left">
            <div className="text-[35px] font-[#246BFD] leading-[50px]">Analog To Digital</div>
            <span className="text-white text-[42.5px] leading-[50px] block">아날로그 데이터의</span>
            <span className="text-white text-[42.5px] leading-[50px] block">디지털화</span>
          </h1>
        </div>

        <div className="flex flex-col mt-[50px] items-center">
          <div className="w-[350px] h-[55px] mb-[15px] bg-[#262A34] text-white rounded-[25px] flex items-center justify-center">
            <SubmitButton onClick={() => navigate("/signin")} className="bg-[#262A34]">로그인</SubmitButton>
          </div>
          <div className="w-[350px] h-[55px] bg-[#246BFD] text-white rounded-[25px] flex items-center justify-center">
            <SubmitButton onClick={() => navigate("/signup")}>회원가입</SubmitButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;