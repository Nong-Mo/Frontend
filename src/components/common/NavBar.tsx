import React from "react";
import { useNavigate } from "react-router-dom";
import leftIcon from "../../icons/common/leftIcon.svg";
import menu from "../../icons/common/menu.svg";

interface NavigationProps {
  onMenuClick?: () => void;
  title?: string;
}

export const NavBar: React.FC<NavigationProps> = ({ onMenuClick, title }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center w-362 h-[56px] justify-between">
      <img
        src={leftIcon}
        className="w-7 h-7 cursor-pointer"
        alt="back"
        onClick={() => navigate(-1)}
      />
      <span className="text-xl text-white">{title}</span>
      <img
        src={menu}
        className="w-6 h-6 cursor-pointer"
        alt="Menu"
        onClick={onMenuClick}
      />
    </div>
  );
};