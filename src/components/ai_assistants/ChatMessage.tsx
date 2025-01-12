import React from 'react';
import { FaRobot } from 'react-icons/fa';

interface ChatMessageProps {
    sender: string;
    text: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ sender, text }) => {
    const isAI = sender === "ai";

    return (
        <div
            className={`mb-[20px] rounded-[16.5px] flex ${
                isAI ? "items-start" : "items-end"
            } ${isAI ? "self-start" : "self-end"}`}
        >
            {isAI && (
                <div className="w-[27px] h-[27px] flex-shrink-0 flex items-center justify-center mr-3">
                    <FaRobot className="text-white w-full h-full" />
                </div>
            )}
            <div
                className={`rounded-[16.5px] flex items-center justify-center ${
                    isAI
                        ? "bg-[#252934] text-white"
                        : "bg-[#246BFD] text-white"
                } text-[14px] font-bold leading-[20px]`}
                style={{
                    wordBreak: "break-word",
                    width: 'auto',
                    minWidth: 'auto'
                }}
            >
                <p className="w-full text-[14px] font-bold leading-[20px] p-[14px]">
                    {text}
                </p>
            </div>
        </div>
    );
};

export default ChatMessage;