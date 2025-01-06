import React from 'react';
import { FaGreaterThan } from 'react-icons/fa';

interface BoxListProps {
    title: string;
    count: number;
    icon: React.ReactNode; // ReactNode 타입으로 변경
    countColor?: string; // Optional color for the count
}

const BoxList: React.FC<BoxListProps> = ({ title, count, icon, countColor }) => {
    const iconWithColor = React.cloneElement(icon as React.ReactElement, { style: { color: '#200745', fontSize: '20px' } });

    return (
        <div className="relative w-[350px] h-[67.2px] mt-[15px] bg-[#252934] rounded-2xl border border-[#ffb8df] flex items-center">

            {/* 아이콘 */}
            <div className="absolute left-3 w-[50.4px] h-[50.4px] flex-shrink-0 overflow-hidden flex items-center justify-center rounded-[12.6px]" style={{ backgroundColor: countColor }}>
                {iconWithColor}
            </div>

            {/* 제목과 숫자 */}
            <div className="absolute left-[80px] flex-1">
                <p className="text-[17.5px] font-bold">{title}</p>
            </div>
            <span className="absolute right-[40px] text-[17.5px] font-bold" style={{ color: countColor }}>
                {count}
            </span>

            {/* 화살표 아이콘 */}
            <FaGreaterThan className="absolute right-4 w-3 h-3 text-white"/>
        </div>
    );
};

export default BoxList;