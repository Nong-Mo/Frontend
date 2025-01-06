import React from 'react';
import { FaGreaterThan } from 'react-icons/fa';

interface BoxListProps {
    title: string;
    count: number;
    icon: React.ReactNode;
    countColor?: string;
}

const BoxList: React.FC<BoxListProps> = ({ title, count, icon, countColor }) => {
    const iconWithColor = React.cloneElement(icon as React.ReactElement, {
        style: { color: '#200745', fontSize: '20px' },
    });

    return (
        <div className="hover:border-gradient relative w-[350px] h-[67.2px] mt-[15px] rounded-2xl">
            {/* 내부 컨텐츠 */}
            <div className="content flex items-center w-full h-full">
                {/* 아이콘 */}
                <div
                    className="w-[50.4px] h-[50.4px] flex-shrink-0 overflow-hidden flex items-center justify-center rounded-[12.6px]"
                    style={{backgroundColor: countColor}}
                >
                    {iconWithColor}
                </div>

                {/* 제목과 숫자 */}
                <div className="flex-1 ml-4">
                    <p className="text-[17.5px] font-bold">{title}</p>
                </div>
                <span
                    className="text-[17.5px] font-bold"
                    style={{color: countColor}}
                >
            {count}
        </span>

                {/* 화살표 아이콘 */}
                <FaGreaterThan className="ml-4 w-3 h-3 text-white"/>
            </div>
        </div>
    );
};

export default BoxList;