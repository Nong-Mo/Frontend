import React, { useState, useEffect } from "react";
import { FaTimes, FaCheck } from "react-icons/fa";

const VoiceRecognitionBar: React.FC<{
    isListening: boolean;
    duration: number; // 최대 음성 인식 시간 (초 단위)
    onCancel: () => void; // 취소 버튼 클릭 시 실행
    onComplete: (text: string) => void; // 완�� 버튼 클릭 시 실행
    transcript: string; // 음성 인식 결과 전달
}> = ({ isListening, duration, onCancel, onComplete, transcript }) => {
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        if (isListening) {
            timer = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000); // 1초마다 업데이트
        } else if (timer) {
            clearInterval(timer);
        }
        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [isListening]);

    const progressPercentage = Math.min((elapsedTime / duration) * 100, 100);

    return (
        isListening && (
            <div className="fixed bottom-[35px] w-[350px] h-[48px] bg-[#262A34] rounded-[16.5px] flex items-center justify-center">
                {/* 내부 요소를 묶는 박스 */}
                <div className="flex items-center w-[315px] justify-between">
                    {/* 취소 버튼 */}
                    <button
                        onClick={() => {
                            if (transcript.trim() !== "") {
                                onComplete(transcript); // 바로 채팅창에 추가
                            }
                        }}
                        className="text-white w-6 h-6 rounded-full flex items-center justify-center bg-[#5E6272]"
                    >
                        <FaCheck size={13}/>
                    </button>

                    {/* 진행 바 */}
                    <div className="mx-4 h-2 relative flex items-center w-[180px]">
                        <div className="w-full h-2 bg-[#5E6272] rounded-full">
                            <div
                                className="h-full bg-white rounded-full"
                                style={{width: `${progressPercentage}%`}}
                            ></div>
                        </div>
                    </div>

                    {/* 타이머 */}
                    <span className="text-white font-bold">
                        {`0:${elapsedTime < 10 ? `0${elapsedTime}` : elapsedTime}`}
                    </span>

                    {/* 완료 버튼 */}
                    <button
                        onClick={() => {
                            console.log("Transcript onComplete:", transcript); // 디버깅용 로그
                            if (transcript.trim() !== "") {
                                onComplete(transcript);
                            } else {
                                console.log("Transcript is empty."); // 디버깅용 로그
                            }
                        }}
                        className="text-white w-6 h-6 rounded-full flex items-center justify-center bg-[#5E6272]"
                    >
                        <FaCheck size={13}/>
                    </button>
                </div>
            </div>
        )
    );
};

export default VoiceRecognitionBar;