import React from 'react';
import { FaGreaterThan } from 'react-icons/fa';

interface BoxListProps {
    title: string;
    count: number;
    icon: React.ReactNode;
    countColor?: string;
    isActive: boolean;
}

const BoxList: React.FC<BoxListProps> = ({ title, count, icon, countColor, isActive }) => {
    // 기본 회색 색상
    const grayColor = '#808080';

    const iconWithColor = React.cloneElement(icon as React.ReactElement, {
        style: {
            color: '#200745',
            fontSize: '20px'
        },
    });

    return (
        <div className={`hover:border-gradient relative w-[350px] h-[67.2px] mt-[15px] rounded-2xl ${!isActive && 'opacity-50'}`}>
            <div className="content flex items-center w-full h-full">
                <div
                    className="w-[50.4px] h-[50.4px] flex-shrink-0 overflow-hidden flex items-center justify-center rounded-[12.6px]"
                    style={{
                        backgroundColor: isActive ? countColor : grayColor
                    }}
                >
                    {iconWithColor}
                </div>

                <div className="flex-1 ml-4">
                    <p className={`text-[17.5px] font-bold ${!isActive && 'text-gray-500'}`}>
                        {title}
                    </p>
                </div>
                <span
                    className="text-[17.5px] font-bold"
                    style={{
                        color: isActive ? countColor : grayColor
                    }}
                >
                    {count}
                </span>

                <FaGreaterThan className={`ml-4 w-3 h-3 ${isActive ? 'text-white' : 'text-gray-500'}`}/>
            </div>
        </div>
    );
};

export default BoxList;