import React from "react";
import { useNavigate } from 'react-router-dom';
import profile from "../../icons/home/profile.svg"; // 프로필 아이콘 import

export const HomeTitle = ({ userName }) => {
  const navigate = useNavigate();
  const firstLetter = userName.charAt(0).toUpperCase(); // 사용자 닉네임 첫 글자 추출 및 대문자 변환

  return (
    <div className="pt-[48px] flex justify-center">
        <div className="flex items-center w-362 h-[56px] justify-between">
            <span className="text-[18px] text-white">{userName} 님의 보관함</span>
            <div className="relative w-10 h-10 cursor-pointer">
              <img
                  onClick={() => navigate('/profile')}
                  src={profile}
                  alt="프로필"
                  className="w-full h-full rounded-full" // 이미지를 꽉 채우도록 설정
              />
              <div className="absolute inset-0 flex items-center justify-center text-black font-bold text-lg">
                {firstLetter}
              </div>
            </div>
        </div>
    </div>
  );
};