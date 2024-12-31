import { FC } from "react";
import { useNavigate } from "react-router-dom";
import homeImage from "../icons/intro/home.svg"; // Import the home.svg image

const Intro: FC = () => {
  const navigate = useNavigate();

  return (
        <div className="page-container flex flex-col min-h-screen z-10">
            <div className="w-full  text-blue-500 flex flex-col items-center mx-auto">
                <img src={homeImage} alt="Home" className="w-full max-w-[500px] mb-[20px]" /> {/* mb-[-10px] 제거 및 수정 */}
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