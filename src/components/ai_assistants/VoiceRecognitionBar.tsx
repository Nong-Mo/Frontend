import React, { useState, useEffect } from "react";
import { FaTimes, FaCheck } from "react-icons/fa";

const VoiceRecognitionBar: React.FC<{
    isListening: boolean;
    duration: number;
    onCancel: () => void;
    onComplete: (text: string) => void;
    transcript: string;
}> = ({ isListening, duration, onCancel, onComplete, transcript }) => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [progressPercentage, setProgressPercentage] = useState(0);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        if (isListening) {
            timer = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
                setProgressPercentage((prev) => Math.min((prev + 1) / duration * 100, 100));
            }, 1000);
        } else if (timer) {
            clearInterval(timer);
        }
        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [isListening, duration]);

    return (
        isListening && (
            <div className="fixed bottom-[35px] w-[350px] h-[48px] bg-[#262A34] rounded-[16.5px] flex items-center justify-center">
                <div className="flex items-center w-[315px] justify-between">
                    <button
                        onClick={() => {
                            onCancel();
                            setElapsedTime(0);
                            setProgressPercentage(0);
                        }}
                        className="text-white w-8 h-8 rounded-full flex items-center justify-center bg-[#5E6272]"
                    >
                        <FaTimes size={16}/>
                    </button>

                    <div className="mx-4 h-2 relative flex items-center w-[180px]">
                        <div className="w-full h-2 bg-[#5E6272] rounded-full">
                            <div
                                className="h-full bg-white rounded-full"
                                style={{width: `${progressPercentage}%`}}
                            ></div>
                        </div>
                    </div>

                    <span className="text-white font-bold">
                        {`0:${elapsedTime < 10 ? `0${elapsedTime}` : elapsedTime}`}
                    </span>

                    <button
                        onClick={() => {
                            if (transcript.trim() !== "") {
                                onComplete(transcript);
                                setElapsedTime(0);
                                setProgressPercentage(0);
                            }
                        }}
                        className="text-white w-8 h-8 rounded-full flex items-center justify-center bg-[#5E6272]"
                    >
                        <FaCheck size={16}/>
                    </button>
                </div>
            </div>
        )
    );
};

export default VoiceRecognitionBar;