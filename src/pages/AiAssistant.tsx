import React, { useState } from 'react';
import { NavBar } from "../components/common/NavBar.tsx";
import InfoText from "../components/common/InfoText.tsx";
import ChatMessage from "../components/ai_assistants/ChatMessage.tsx";
import ChatInput from "../components/ai_assistants/ChatInput.tsx";
import useVoiceRecognition from "../hooks/useVoiceRecognition";
import useSpeechSynthesis from "../hooks/useSpeechSynthesis";
import VoiceRecognitionBar from "../components/ai_assistants/VoiceRecognitionBar.tsx";

const AIAssistantPage: React.FC = () => {
    const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
    const [inputText, setInputText] = useState("");

    const { startRecognition, isListening, stopRecognition } = useVoiceRecognition((text) => setInputText(text));
    const { speakText } = useSpeechSynthesis();

    const buttons = [
        "마지막으로 열어 본 파일을 보여줘",
        "A2D 서비스 사용 방법을 알려줘",
        "내 보관함 통계를 보여줘"
    ];

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newMessages = [...messages, { sender: "user", text: inputText }];
        setMessages(newMessages);
        setInputText("");

        const aiResponse = generateAIResponse(inputText);
        setTimeout(() => {
            setMessages((prev) => [...prev, { sender: "ai", text: aiResponse }]);
            speakText(aiResponse);
        }, 500);
    };

    const handleNewChat = () => {
        setMessages([]);
        setInputText("");
    };

    const handleButtonClick = (text: string) => {
        const newMessages = [...messages, { sender: "user", text }];
        setMessages(newMessages);

        const aiResponse = generateAIResponse(text);
        setTimeout(() => {
            setMessages((prev) => [...prev, { sender: "ai", text: aiResponse }]);
            speakText(aiResponse);
        }, 500);
    };

    const generateAIResponse = (userText: string): string => {
        return `AI의 응답: "${userText}"에 대한 정보를 찾았습니다.`;
    };

    return (
        <div className="w-full h-[817px] flex flex-col px-[32px] z-10 relative">
            {/* NavBar */}
            <NavBar
                title="AI 어시스턴트"
                hideLeftIcon={false}
                showMenu={false}
                iconNames={{
                    backIcon: "뒤로가기",
                    editIcon: "편집"
                }}
                rightIcons={['edit']}
                onNewChatClick={handleNewChat}
            />

            {/* Title */}
            <div className="w-full primary-info-text mb-4">
                <InfoText title="AI와 함께 원하는" subtitle="데이터를 찾아 보세요." />
            </div>

            {/* Chat Messages */}
            <div className="w-[350px] h-[554px] mt-[30px] mb-[20px] rounded-[16.5px] flex flex-col overflow-y-auto relative">
                {/* 채팅 메시지 */}
                {messages.map((msg, index) => (
                    <ChatMessage key={index} sender={msg.sender} text={msg.text} />
                ))}

                {/* 버튼 영역 */}
                {!isListening && messages.length === 0 && (
                    <div className="flex mt-auto overflow-x-auto whitespace-nowrap">
                        {buttons.map((text, index) => (
                            <div key={index} className="inline-block mr-[20px]">
                                <div
                                    className="hover:border-gradient w-[130px] h-[67px] rounded-[16.5px] flex items-center justify-center relative group">
                                    <button
                                        className="w-full h-full bg-[#262A34] rounded-[14.5px] flex justify-center items-center relative overflow-hidden"
                                        onClick={() => handleButtonClick(text)}
                                    >
                                        <div
                                            className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                        <div
                                            className="w-[95px] h-[34px] font-bold text-white text-[12px] text-left whitespace-normal z-10">
                                            {text}
                                        </div>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 음성 인식 프로그레스 바 */}
                {isListening && (
                    <VoiceRecognitionBar
                        isListening={isListening}
                        duration={60}
                        onCancel={() => {
                            stopRecognition();
                            setInputText("");
                        }}
                        onComplete={() => {
                            stopRecognition();
                            if (inputText.trim()) {
                                const newMessages = [...messages, { sender: "user", text: inputText }];
                                setMessages(newMessages);

                                const aiResponse = generateAIResponse(inputText);
                                setTimeout(() => {
                                    setMessages((prev) => [...prev, { sender: "ai", text: aiResponse }]);
                                    speakText(aiResponse);
                                }, 500);
                            }
                            setInputText("");
                        }}
                    />
                )}
            </div>

            {/* Chat Input */}
            <ChatInput
                inputText={inputText}
                setInputText={setInputText}
                onSend={handleSend}
                onStartVoiceRecognition={startRecognition}
                isListening={isListening}
            />
        </div>
    );
};

export default AIAssistantPage;
