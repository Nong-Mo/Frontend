import React, {useEffect} from "react";
import {useNavigate, useNavigationType} from "react-router-dom";
import {LiaExchangeAltSolid} from "react-icons/lia";
import {IoChevronBackOutline} from "react-icons/io5";
import {RiRobot2Fill} from "react-icons/ri";
import {BiEdit} from "react-icons/bi";

interface NavigationProps {
    onMenuClick?: () => void;
    title?: string;
    showMenu?: boolean;
    hideLeftIcon?: boolean;
    alignTitle?: 'left' | 'center';
    backPageName?: string;
    replacePageName?: boolean;
    onNewChatClick?: () => void;
    iconNames?: {
        backIcon?: string;
        convertIcon?: string;
        aiIcon?: string;
        editIcon?: string;
    };
    rightIcons?: Array<'convert' | 'ai' | 'edit'>;
}

export const NavBar: React.FC<NavigationProps> = ({
                                                      onMenuClick,
                                                      title,
                                                      showMenu = true,
                                                      hideLeftIcon = false,
                                                      alignTitle = 'center',
                                                      backPageName = '',
                                                      replacePageName = false,
                                                      onNewChatClick,
                                                      iconNames = {},
                                                      rightIcons = []
                                                  }) => {
    const navigate = useNavigate();
    const navigationList = useNavigationType();

    const renderIcon = (icon: 'convert' | 'ai' | 'edit') => {
        switch (icon) {
            case 'convert':
                return (
                    <button
                        className="text-white flex items-center justify-center w-7 h-7 p-0"
                        onClick={onMenuClick}
                        aria-label={iconNames.convertIcon || "변환하기"}
                    >
                        <LiaExchangeAltSolid size={24}/>
                    </button>
                );
            case 'ai':
                return (
                    <button
                        className="text-white flex items-center justify-center w-7 h-7 p-0"
                        onClick={() => navigate('/ai-assistant')}
                        aria-label={iconNames.aiIcon || "AI 로봇"}
                    >
                        <RiRobot2Fill size={24}/>
                    </button>
                );
            case 'edit':
                return (
                    <button
                        className="text-white flex items-center justify-center w-7 h-7 p-0"
                        onClick={onNewChatClick}
                        aria-label={iconNames.editIcon || "편집"}
                    >
                        <BiEdit size={24}/>
                    </button>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex justify-center">
            <div className="flex items-center justify-between w-full max-w-[350px] h-[50px] relative">
                {!hideLeftIcon && (
                    <button
                        className="absolute left-0 text-white flex items-center justify-center w-7 h-7 p-0"
                        onClick={() => navigate(backPageName === '' ? -1 as number : backPageName)}
                        aria-label={iconNames.backIcon || "뒤로가기"}
                    >
                        <IoChevronBackOutline size={24}/>
                    </button>
                )}

                <span
                    className={`font-bold text-[20px] text-white flex-1 ${alignTitle === 'left' ? 'text-left' : 'text-center'}`}
                    style={{lineHeight: '25.2px'}}
                >
                    {title}
                </span>

                <div className="absolute right-0 flex gap-3">
                    {rightIcons.map((icon, index) => (
                        <div key={index}>
                            {renderIcon(icon)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};