import React from 'react';
import { FaRobot } from 'react-icons/fa';

// ChatMessage 컴포넌트의 props 인터페이스 정의
interface ChatMessageProps {
    sender: string; // 메시지 발신자
    text: string; // 메시지 텍스트
}

// ChatMessage 컴포넌트 정의
const ChatMessage: React.FC<ChatMessageProps> = ({ sender, text }) => {
    const isAI = sender === "ai"; // 발신자가 AI인지 여부

    return (
        <div
            className={`mb-[20px] rounded-[16.5px] flex ${
                isAI ? "items-start" : "items-end"
            } ${isAI ? "self-start" : "self-end"}`}
        >
            {/* AI 메시지 아이콘 */}
            {isAI && <FaRobot className="text-white mr-3" size={27} />}
            <div
                className={`rounded-[16.5px] p-3 ${
                    isAI
                        ? "bg-[#252934] text-white"
                        : "bg-[#246BFD] text-white"
                } text-[14px] font-bold leading-[20px]`}
                style={{
                    wordBreak: "break-word", // 텍스트가 길 경우 줄바꿈
                    display: "inline-block", // 텍스트 길이에 따라 박스 크기 조정
                    maxWidth: "100%", // 최대 박스 너비 제한
                    minWidth: isAI ? undefined : "100px", // 사용자 메시지에 최소 너비 적용
                }}
            >
                {text}
            </div>
        </div>
    );
};

export default ChatMessage;