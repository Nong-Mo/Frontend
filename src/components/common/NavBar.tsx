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
    hideLeftIcon?: boolean;  // 왼쪽 아이콘 숨김 여부
    alignTitle?: 'left' | 'center';  // 제목 정렬 옵션 추가
}

export const NavBar: React.FC<NavigationProps> = ({
                                                      onMenuClick,
                                                      title,
                                                      showMenu = true,
                                                      rightIcon = 'convert',  // 기본값은 convert
                                                      hideLeftIcon = false,  // 기본값은 false
                                                      alignTitle = 'center'  // 기본값은 center
                                                  }) => {
    const navigate = useNavigate();

    // 아이콘 매핑
    const icons = {
        convert: convert,
        search: search
    };

    return (
        <div className="flex justify-center">
            <div className="flex items-center justify-between w-full max-w-[350px] h-[50px] relative">
                {!hideLeftIcon && (
                    <img
                        src={leftIcon}
                        className="w-7 h-7 cursor-pointer absolute"
                        alt="back"
                        onClick={() => navigate(-1)}
                    />
                )}

                <span
                    className={`font-bold text-[20px] text-white flex-1 ${alignTitle === 'left' ? 'text-left' : 'text-center'}`}
                    style={{lineHeight: '25.2px'}}>
  {title}
</span>

                {showMenu && (
                    <img
                        src={icons[rightIcon]}  // rightIcon prop에 따라 아이콘 변경
                        className="w-4 h-4 cursor-pointer absolute right-1"
                        alt={rightIcon}
                        onClick={onMenuClick}
                    />
                )}
            </div>
        </div>
    );
};