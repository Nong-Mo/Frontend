import React from 'react';
import {FaBook, FaHeadphones} from "react-icons/fa";
import {IoMdMore} from "react-icons/io";

interface CollectionItemProps {
    title: string;
    date: string;
    itemType: string;
    onClickItem?: () => void;
}

const CollectionItem = ({title, date, itemType, onClickItem}: CollectionItemProps) => {
    // 아이템 타입에 따른 아이콘 반환 함수
    const getItemIcon = () => {
        const iconSize = 15;  // 모든 아이콘에 동일한 크기 적용

        switch (itemType) {
            case 'book':
                return <FaBook size={iconSize}/>;
            case 'receipt':
                return <FaHeadphones size={iconSize}/>;
        }

        console.log(itemType);
    };

    // 아이템 타입에 따른 배경색 반환 함수
    const getIconBackgroundColor = () => {
        switch (itemType) {
            case 'book':
                return 'bg-[#FFDD72]';  // 책은 노란색
            case 'receipt':
                return 'bg-[#72FFDD]';  // 오디오는 민트색
        }
    };

    const handleMoreClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <button
            className="w-[165px] h-[165px] bg-[#262A34] rounded-[12px] text-left cursor-pointer hover:bg-[#2d3341] transition-colors"
            onClick={onClickItem}
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