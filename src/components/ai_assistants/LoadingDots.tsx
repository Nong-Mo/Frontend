import React from 'react';
import { FaRobot } from 'react-icons/fa';

const LoadingDots = () => {
    return (
        <div className="mb-[20px] rounded-[16.5px] flex items-start self-start">
            <div className="w-[27px] h-[27px] flex-shrink-0 flex items-center justify-center mr-3">
                <FaRobot className="text-white w-full h-full" />
            </div>
            <div className="bg-[#252934] rounded-[16.5px] p-[14px] flex items-center">
                <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                </div>
            </div>
        </div>
    );
};

export default LoadingDots;
