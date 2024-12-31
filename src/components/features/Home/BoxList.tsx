import React from 'react';
import { useNavigate } from 'react-router-dom';
import arrow from "../../../icons/home/arrow.svg";

interface BoxListProps {
    title: string;
    count: number;
    icon: string; // Image URL as string
    countColor?: string; // Optional color for the count
}

const BoxList: React.FC<BoxListProps> = ({ title, count, icon, countColor }) => {
    return (
        <div className="flex items-center bg-[#262A34] my-2 p-4 rounded-lg">
            {/* 아이콘 */}
            <div className="w-[48px] h-[48px] mr-4 flex-shrink-0 overflow-hidden">
                <img src={icon} alt={title} className="w-full h-full object-cover" />
            </div>
            {/* 제목과 숫자 */}
            <div className="flex-1">
                <p className="text-lg">{title}</p>
            </div>
            <span
                className="text-lg font-bold mr-4"
                style={{ color: countColor }}
            >
                {count}
            </span>
            <img
                src={arrow}
                alt="화살표"
            />
        </div>
    );
};

export default BoxList;