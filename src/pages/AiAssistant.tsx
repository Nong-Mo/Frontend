import React from 'react';
import { NavBar } from "../components/common/NavBar.tsx";
import InfoText from "../components/common/InfoText.tsx";
import { FaMicrophone } from 'react-icons/fa';
import { FaPaperPlane } from 'react-icons/fa';

const AIAssistantPage: React.FC = () => {
    const buttons = [
        "마지막으로 열어 본 파일을 보여줘",
        "A2D 서비스 사용 방법을 알려줘",
        "내 보관함 통계를 보여줘"
    ];

    return (
        <div className="w-full h-[817px] flex flex-col px-[32px] z-10">

            {/* NavBar Div */}
            <NavBar title="AI 어시스턴트" showMenu={false} />

            {/* Title Div */}
            <div className="w-full primary-info-text">
                <InfoText title="AI와 함께 원하는" subtitle="데이터를 찾아 보세요." />
            </div>

            {/* 채팅 배경 영역 */}
            <div className="w-[350px] h-[554px] mt-[30px] mb-[20px] flex flex-col overflow-hidden">
                {/* 버튼 영역 */}
                <div className="mt-auto overflow-x-auto whitespace-nowrap">
                    {buttons.map((text, index) => (
                        <div key={index} className="inline-block mr-[20px]">
                            <div
                                className="hover:border-gradient w-[108px] h-[67px] rounded-[16.5px] flex items-center justify-center relative group">
                                <button
                                    className="w-full h-full bg-[#262A34] rounded-[14.5px] flex justify-center items-center relative overflow-hidden">
                                    {/* 오버레이 */}
                                    <div
                                        className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                    <div
                                        className="w-[72px] h-[34px] font-bold text-white text-[10px] text-left whitespace-normal z-10">
                                        {text}
                                    </div>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 입력창 */}
            <div className="w-[350px] h-[48px] bg-[#262A34] rounded-[16.5px] flex justify-center items-center">
                <div className="w-[315px] h-[24px] flex items-center">
                    <input
                        type="text"
                        placeholder="무엇이든 물어보세요."
                        className="placeholder-[#5E6272] font-bold text-[14px] text-white bg-transparent outline-none flex-grow"
                    />
                    <button className="text-white text-[15px]">
                        <FaMicrophone/>
                    </button>
                    <button
                        className="bg-[#246BFD] text-white text-[10px] w-[20px] h-[20px] rounded-full flex items-center justify-center ml-2">
                        <FaPaperPlane />
                    </button>
                </div>
            </div>

        </div>
    );
};

export default AIAssistantPage;