import React from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi"; // React Icons에서 Edit 아이콘 가져오기
import leftIcon from "../../icons/common/leftIcon.svg";
import menu from "../../icons/common/menu.svg";
import search from "../../icons/common/search.svg";
import convert from "../../icons/common/convert.svg";

interface NavigationProps {
    onMenuClick?: () => void;
    title?: string;
    showMenu?: boolean;
    rightIcon?: 'convert' | 'search' | 'newChat';  // 'newChat' 추가
    hideLeftIcon?: boolean;
    alignTitle?: 'left' | 'center';
    onNewChatClick?: () => void; // 새 채팅 버튼 클릭 이벤트 핸들러
}

export const NavBar: React.FC<NavigationProps> = ({
                                                      onMenuClick,
                                                      title,
                                                      showMenu = true,
                                                      rightIcon = 'convert',
                                                      hideLeftIcon = false,
                                                      alignTitle = 'center',
                                                      onNewChatClick
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
                {/* 왼쪽 아이콘 */}
                {!hideLeftIcon && (
                    <img
                        src={leftIcon}
                        className="w-7 h-7 cursor-pointer absolute"
                        alt="back"
                        onClick={() => navigate(-1)}
                    />
                )}

                {/* 제목 */}
                <span
                    className={`font-bold text-[20px] text-white flex-1 ${alignTitle === 'left' ? 'text-left' : 'text-center'}`}
                    style={{ lineHeight: '25.2px' }}
                >
                    {title}
                </span>

                {/* 오른쪽 아이콘 */}
                {showMenu && rightIcon !== 'newChat' && (
                    <img
                        src={icons[rightIcon]} // rightIcon prop에 따라 아이콘 변경
                        className="w-4 h-4 cursor-pointer flex items-center absolute right-1"
                        alt={rightIcon}
                        onClick={onMenuClick}
                    />
                )}

                {/* 새 채팅 아이콘 */}
                {rightIcon === 'newChat' && (
                    <button
                        className="w-4 h-4 text-white flex items-center absolute right-1"
                        onClick={onNewChatClick}
                        aria-label="새 채팅"
                    >
                        <FiEdit size={20} /> {/* Edit 아이콘 */}
                    </button>
                )}
            </div>
        </div>
    );
};
