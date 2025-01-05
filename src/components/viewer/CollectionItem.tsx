import React from 'react';
import {FaBook} from "react-icons/fa";
import {IoMdMore} from "react-icons/io";

interface CollectionItemProps {
    title: string;
    date: string;
    onClick?: () => void;  // 클릭 핸들러 추가
}

const CollectionItem = ({title, date, onClick}: CollectionItemProps) => {
    const handleMoreClick = (e: React.MouseEvent) => {
        e.stopPropagation();  // 더보기 버튼 클릭시 전체 버튼 클릭 이벤트 방지
    }

    return (
        <button
            className="w-[165px] h-[165px] bg-[#262A34] rounded-[12px] text-left cursor-pointer hover:bg-[#2d3341] transition-colors"
            onClick={onClick}
            type="button"
            aria-label={`책 ${title} 열기`}
        >
            <div className="w-full h-full pl-[15px] pr-[15px] pt-[19px] pb-[18.5px]">
                <div className="flex justify-between items-center w-full h-[31px]">
                    {/* Icon Div */}
                    <div className="flex justify-center items-center w-[31px] h-[31px] bg-[#FFDD72] rounded-[12px]">
                        <FaBook size={15} />
                    </div>
                    {/* More Button */}
                    <button
                        type="button"
                        onClick={handleMoreClick}
                        className="p-1 hover:bg-[#3d4251] rounded-full transition-colors"
                        aria-label="더보기"
                    >
                        <IoMdMore size={20} className="text-white"/>
                    </button>
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