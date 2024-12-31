import React from "react";
import { useNavigate } from "react-router-dom";
import leftIcon from "../../icons/common/leftIcon.svg";
import menu from "../../icons/common/menu.svg";

interface NavigationProps {
    onMenuClick?: () => void;
  }
  
  export const NavBar: React.FC<NavigationProps> = ({ 
    onMenuClick 
  }) => {
    const navigate = useNavigate();
  
    return (
        <div className="flex items-center w-full px-10 pt-8 relative"> 
          <img 
            src={leftIcon} 
            className="w-7 h-7 cursor-pointer" 
            alt="back"
            onClick={() => navigate(-1)}
          />
          
          <img
            src={menu}
            className="w-6 h-6 cursor-pointer ml-auto"
            alt="Menu"
            onClick={onMenuClick}
          />
        </div>
      );
  };