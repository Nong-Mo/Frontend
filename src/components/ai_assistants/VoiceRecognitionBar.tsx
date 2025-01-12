import React, { useState, useEffect } from "react";
import { FaTimes, FaCheck } from "react-icons/fa";

/**
 * 음성 인식 진행 상태를 표시하는 컴포넌트
 *
 * @component
 * @param props
 * @param {boolean} props.isListening - 현재 음성 인식 중인지 여부
 * @param {number} props.duration - 최대 녹음 시간 (초)
 * @param {Function} props.onCancel - 음성 인식 취소 핸들러
 * @param {Function} props.onComplete - 음성 인식 완료 핸들러
 * @param {string} props.transcript - 현재까지 인식된 텍스트
 * @param {number} props.startTime - 음성 인식 시작 시간 (milliseconds)
 */

const VoiceRecognitionBar: React.FC<{
    isListening: boolean;
    duration: number;
    onCancel: () => void;
    onComplete: (text: string) => void;
    transcript: string;
    startTime: number;
}> = ({ isListening, duration, onCancel, onComplete, transcript, startTime }) => {
    // 상태 관리
    const [elapsedTime, setElapsedTime] = useState(0);             // 경과 시간 (초)
    const [progressPercentage, setProgressPercentage] = useState(0);// 진행률 (%)
    const [isCompleting, setIsCompleting] = useState(false);        // 완료 처리 중 여부

    /**
     * 타이머 및 프로그레스 바 업데이트를 위한 효과
     * 100ms 간격으로 경과 시간과 진행률을 업데이트
     */
    useEffect(() => {
        // 음성 인식이 종료되면 상태 초기화
        if (!isListening) {
            setElapsedTime(0);
            setProgressPercentage(0);
            setIsCompleting(false);
            return;
        }

        // 타이머 설정
        const interval = setInterval(() => {
            const currentTime = Math.floor((Date.now() - startTime) / 1000);

            // 최대 시간 도달 시 자동 완료
            if (currentTime >= duration) {
                if (!isCompleting) {
                    setIsCompleting(true);
                    onComplete(transcript);
                }
                clearInterval(interval);
                return;
            }

            // 경과 시간과 진행률 업데이트
            setElapsedTime(currentTime);
            setProgressPercentage((currentTime / duration) * 100);
        }, 100);

        // cleanup 함수
        return () => clearInterval(interval);
    }, [isListening, duration, onComplete, transcript, startTime, isCompleting]);

    // 음성 인식 중일 때만 컴포넌트 렌더링
    return (
        isListening && (
            <div className="fixed bottom-[58.5px] w-[350px] h-[48px] bg-[#262A34] rounded-[16.5px] flex items-center justify-center">
                <div className="flex items-center w-[315px] justify-between">
                    {/* 취소 버튼 */}
                    <button
                        onClick={() => {
                            if (!isCompleting) {
                                onCancel();
                                setElapsedTime(0);
                                setProgressPercentage(0);
                            }
                        }}
                        className="text-white w-8 h-8 rounded-full flex items-center justify-center bg-[#5E6272]"
                    >
                        <FaTimes size={16} />
                    </button>

                    {/* 프로그레스 바 */}
                    <div className="mx-4 h-2 relative flex items-center w-[180px]">
                        <div className="w-full h-2 bg-[#5E6272] rounded-full">
                            <div
                                className="h-full bg-white rounded-full transition-all duration-100"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* 경과 시간 표시 */}
                    <span className="text-white font-bold">
                        {`0:${elapsedTime < 10 ? `0${elapsedTime}` : elapsedTime}`}
                    </span>

                    {/* 완료 버튼 */}
                    <button
                        onClick={() => {
                            if (!isCompleting && transcript.trim() !== "") {
                                setIsCompleting(true);
                                onComplete(transcript);
                                setElapsedTime(0);
                                setProgressPercentage(0);
                            }
                        }}
                        className="text-white w-8 h-8 rounded-full flex items-center justify-center bg-[#5E6272]"
                    >
                        <FaCheck size={16} />
                    </button>
                </div>
            </div>
        )
    );
};

export default VoiceRecognitionBar;