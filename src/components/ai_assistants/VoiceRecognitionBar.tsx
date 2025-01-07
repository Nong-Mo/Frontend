import React, { useState, useEffect } from 'react';
import { FaTimes, FaCheck } from 'react-icons/fa';

const VoiceRecognitionBar: React.FC<{
    isListening: boolean;
    duration: number; // 최대 음성 인식 시간 (초 단위)
    onCancel: () => void; // 취소 버튼 클릭 시 실행
    onComplete: () => void; // 완료 버튼 클릭 시 실행
}> = ({ isListening, duration, onCancel, onComplete }) => {
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isListening) {
            timer = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000); // 1초마다 업데이트
        } else {
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [isListening]);

    const handleCancel = () => {
        setElapsedTime(0); // 프로그레스 초기화
        onCancel(); // 상위 컴포넌트에서 음성 인식 종료 처리
    };

    const progressPercentage = Math.min((elapsedTime / duration) * 100, 100);

    return (
        isListening && (
            <div className="fixed bottom-0 left-0 w-full bg-[#262A34] flex items-center justify-between px-4 py-2">
                {/* 취소 버튼 */}
                <button onClick={handleCancel} className="text-white flex items-center">
                    <FaTimes size={16} />
                </button>

                {/* 프로그레스 바 */}
                <div className="flex-grow mx-4 h-2 bg-gray-700 rounded-full relative">
                    <div
                        className="absolute left-0 top-0 h-full bg-white rounded-full"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>

                {/* 타이머 */}
                <span className="text-white text-sm">
                    {`0:${elapsedTime < 10 ? `0${elapsedTime}` : elapsedTime}`}
                </span>

                {/* 완료 버튼 */}
                <button onClick={onComplete} className="text-white flex items-center ml-2">
                    <FaCheck size={16} />
                </button>
            </div>
        )
    );
};

export default VoiceRecognitionBar;
