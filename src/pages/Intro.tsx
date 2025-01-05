import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import homeImage from "../icons/intro/home.svg";

const Intro: FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="flex flex-col z-10">
      <div className="w-full text-blue-500 flex flex-col items-center mx-auto">
        <div className="w-full relative flex items-center justify-center">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
            </div>
          )}
          <img 
            src={homeImage} 
            alt="Home" 
            className={`w-full max-w-[500px] mb-[20px] transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            width={440} 
            height={535}
            onLoad={() => setIsLoading(false)}
          />
        </div>
        <div className="pl-[39px] pr-[39px] pb-[37px]">
          <h1 className="font-bold text-left">
            <div className="text-[32px]">Analog To Digital</div>
            <span className="text-white text-[40px]">아날로그 데이터의</span>
            <span className="text-white text-[40px]" style={{ marginTop: '-10px', display: 'block' }}>디지털화</span>
          </h1>
        </div>
        
        <button
          onClick={() => navigate("/signin")}
          className="w-[310px] h-[50px] py-[13px] bg-[#262A34] text-white rounded-[24px]"
        >
          로그인
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="w-[310px] h-[50px] py-[13px] bg-[#246BFD] text-white rounded-[24px] mt-[20px]"
        >
          회원가입
        </button>
      </div>
    </div>
  );
};

export default Intro;