import React from 'react';
import {FaBook, FaHeadphones, FaFilm, FaNewspaper} from "react-icons/fa";
import {IoMdMore} from "react-icons/io";

type ItemType = 'BOOK' | 'AUDIO' | 'VIDEO' | 'ARTICLE';

interface CollectionItemProps {
    title: string;
    date: string;
    itemType: ItemType;
    onClick?: () => void;
}

const CollectionItem = ({title, date, itemType = 'BOOK', onClick}: CollectionItemProps) => {
    // 아이템 타입에 따른 아이콘 반환 함수
    const getItemIcon = () => {
        const iconSize = 15;  // 모든 아이콘에 동일한 크기 적용

        switch (itemType) {
            case 'BOOK':
                return <FaBook size={iconSize}/>;
            case 'AUDIO':
                return <FaHeadphones size={iconSize}/>;
            case 'VIDEO':
                return <FaFilm size={iconSize}/>;
            case 'ARTICLE':
                return <FaNewspaper size={iconSize}/>;
            default:
                return <FaBook size={iconSize}/>;
        }
    };

    // 아이템 타입에 따른 배경색 반환 함수
    const getIconBackgroundColor = () => {
        switch (itemType) {
            case 'BOOK':
                return 'bg-[#FFDD72]';  // 책은 노란색
            case 'AUDIO':
                return 'bg-[#72FFDD]';  // 오디오는 민트색
            case 'VIDEO':
                return 'bg-[#FF72DD]';  // 비디오는 분홍색
            case 'ARTICLE':
                return 'bg-[#72DDFF]';  // 아티클은 하늘색
            default:
                return 'bg-[#FFDD72]';  // 기본값
        }
    };

    const handleMoreClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <button
            className="w-[165px] h-[165px] bg-[#262A34] rounded-[12px] text-left cursor-pointer hover:bg-[#2d3341] transition-colors"
            onClick={onClick}
            type="button"
            aria-label={`${title} 열기`}
        >
            <div className="w-full h-full pl-[15px] pr-[15px] pt-[19px] pb-[18.5px]">
                <div className="flex justify-between items-center w-full h-[31px]">
                    {/* Icon Div - 배경색도 타입에 따라 변경 */}
                    <div className={`flex justify-center items-center w-[31px] h-[31px] ${getIconBackgroundColor()} rounded-[12px]`}>
                        {getItemIcon()}
                    </div>
                    {/* More Button */}
                    <div
                        role="button"
                        onClick={handleMoreClick}
                        className="p-1 hover:bg-[#3d4251] rounded-full transition-colors cursor-pointer"
                        aria-label="더보기"
                    >
                        <IoMdMore size={20}
                                  className="text-white"/>
                    </div>
                </div>
                <div className="mt-[16.3px] h-[48px]">
                    <h1 className="leading-[24px] text-white font-bold text-[17.5px]">{title}</h1>
                </div>
                <div className="mt-[16.7px]">
                    <h1 className="text-white text-xs">{date}</h1>
                </div>
            </div>
        </button>
    );
};

export default CollectionItem;