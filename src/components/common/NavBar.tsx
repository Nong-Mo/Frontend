import React from "react";
import { useNavigate } from "react-router-dom";
import leftIcon from "../../icons/common/leftIcon.svg";
import menu from "../../icons/common/menu.svg";
import search from "../../icons/common/search.svg";  // search 아이콘 import

interface NavigationProps {
  onMenuClick?: () => void;
  title?: string;
  showMenu?: boolean;
  rightIcon?: 'menu' | 'search';  // 오른쪽 아이콘 타입 지정
}

export const NavBar: React.FC<NavigationProps> = ({ 
  onMenuClick, 
  title, 
  showMenu = true,
  rightIcon = 'menu'  // 기본값은 menu
}) => {
  const navigate = useNavigate();

  // 아이콘 매핑
  const icons = {
    menu: menu,
    search: search
  };

  return (
    <div className="pt-[48px] flex justify-center">
      <div className="flex items-center w-full max-w-[400px] h-[56px] relative px-4">
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