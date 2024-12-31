import React from "react";
import { useNavigate } from "react-router-dom";
import leftIcon from "../../icons/common/leftIcon.svg";
import menu from "../../icons/common/menu.svg";
import search from "../../icons/common/search.svg";
import convert from "../../icons/common/convert.svg";

interface NavigationProps {
  onMenuClick?: () => void;
  title?: string;
  showMenu?: boolean;
  rightIcon?: 'convert' | 'search';  // 오른쪽 아이콘 타입 지정
}

export const NavBar: React.FC<NavigationProps> = ({ 
  onMenuClick, 
  title, 
  showMenu = true,
  rightIcon = 'convert'  // 기본값은 menu
}) => {
  const navigate = useNavigate();

  // 아이콘 매핑
  const icons = {
    convert: convert,
    search: search
  };

  return (
    <div className="pt-[44px] flex justify-center">
      <div className="flex items-center w-full max-w-[350px] h-[50px] relative px-[32px]">
        <img
          src={leftIcon}
          className="w-7 h-7 cursor-pointer absolute left-4"
          alt="back"
          onClick={() => navigate(-1)}
        />
        
        <span className="text-xl text-white flex-1 text-center">{title}</span>
        
        {showMenu && (
          <img
            src={icons[rightIcon]}  // rightIcon prop에 따라 아이콘 변경
            className="w-6 h-6 cursor-pointer absolute right-4"
            alt={rightIcon}
            onClick={onMenuClick}
          />
        )}
      </div>
    </div>
  );
};