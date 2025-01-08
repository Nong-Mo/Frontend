import React from 'react';
import { FaMicrophone, FaArrowCircleUp } from 'react-icons/fa';

// ChatInput 컴포넌트의 props 인터페이스 정의
interface ChatInputProps {
    inputText: string; // 입력된 텍스트
    setInputText: (text: string) => void; // 텍스트를 설정하는 함수
    onSend: () => void; // 메시지 전송 함수
    onStartVoiceRecognition: () => void; // 음성 인식 시작 함수
    isListening: boolean; // 음성 인식 중인지 여부
}

// ChatInput 컴포넌트 정의
const ChatInput: React.FC<ChatInputProps> = ({
                                                 inputText,
                                                 setInputText,
                                                 onSend,
                                                 onStartVoiceRecognition,
                                                 isListening,
                                             }) => {
    return (
        <div className="w-[350px] h-[48px] bg-[#262A34] rounded-[16.5px] flex justify-center items-center">
            <div className="w-[315px] h-[24px] flex items-center">
                {/* 텍스트 입력 필드 */}
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="무엇이든 물어보세요."
                    className="placeholder-[#5E6272] font-bold text-[16px] text-white bg-transparent outline-none flex-grow"
                />
                {/* 음성 인식 버튼 */}
                <button onClick={onStartVoiceRecognition} className="text-white text-[20px]" disabled={isListening}>
                    <FaMicrophone />
                </button>
                {/* 메시지 전송 버튼 */}
                <button
                    onClick={onSend}
                    className="bg-[#246BFD] text-white text-[10px] w-[30px] h-[30px] rounded-full flex items-center justify-center ml-2"
                >
                    <FaArrowCircleUp className="text-center text-[20px]" />
                </button>
            </div>
        </div>
    );
};

export default ChatInput;