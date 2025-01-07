import React from 'react';
import { FaMicrophone, FaArrowCircleUp } from 'react-icons/fa';

interface ChatInputProps {
    inputText: string;
    setInputText: (text: string) => void;
    onSend: () => void;
    onStartVoiceRecognition: () => void;
    isListening: boolean;
}

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
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="무엇이든 물어보세요."
                    className="placeholder-[#5E6272] font-bold text-[16px] text-white bg-transparent outline-none flex-grow"
                />
                <button onClick={onStartVoiceRecognition} className="text-white text-[20px]" disabled={isListening}>
                    <FaMicrophone/>
                </button>
                <button
                    onClick={onSend}
                    className="bg-[#246BFD] text-white text-[10px] w-[30px] h-[30px] rounded-full flex items-center justify-center ml-2"
                >
                    <FaArrowCircleUp  className="text-center text-[20px]"/>
                </button>
            </div>
        </div>
    );
};

export default ChatInput;
