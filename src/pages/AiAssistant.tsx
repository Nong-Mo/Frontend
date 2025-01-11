import React, { useState } from 'react';
import { NavBar } from "../components/common/NavBar.tsx";
import InfoText from "../components/common/InfoText.tsx";
import ChatMessage from "../components/ai_assistants/ChatMessage.tsx";
import ChatInput from "../components/ai_assistants/ChatInput.tsx";
import useVoiceRecognition from "../hooks/useVoiceRecognition";
import useSpeechSynthesis from "../hooks/useSpeechSynthesis";
import VoiceRecognitionBar from "../components/ai_assistants/VoiceRecognitionBar.tsx";
import { fetchAIResponse } from '../api/ai';

// Message 타입 정의
interface Message {
    sender: string;
    text: string;
}

const AIAssistantPage: React.FC = () => {
    // useState를 사용한 상태 관리
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { speakText } = useSpeechSynthesis();

    const {
        isListening,
        startRecognition,
        stopRecognition,
        transcript,
        startTime
    } = useVoiceRecognition((text) => {
        addMessage('user', text);
        fetchAndAddAIResponse(text);
    });

    const buttons = [
        "마지막으로 열어 본 파일을 보여줘",
        "A2D 서비스 사용 방법을 알려줘",
        "내 보관함 통계를 보여줘"
    ];

    // 메시지 추가 헬퍼 함수
    const addMessage = (sender: string, text: string) => {
        setMessages(prev => [...prev, { sender, text }]);
    };

    const fetchAndAddAIResponse = async (userText: string) => {
        setIsLoading(true);
        try {
            const aiResponse = await fetchAIResponse(userText);
            addMessage('ai', aiResponse);
            speakText(aiResponse);
        } catch (error) {
            console.error('Error fetching AI response:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async () => {
        if (!inputText.trim()) return;

        addMessage('user', inputText);
        setInputText('');
        await fetchAndAddAIResponse(inputText);
    };

    const handleNewChat = () => {
        setMessages([]);
        setInputText('');
        setIsLoading(false);
    };

    const handleButtonClick = async (text: string) => {
        addMessage('user', text);
        await fetchAndAddAIResponse(text);
    };

    return (
        <div className="w-full h-[817px] flex flex-col px-[32px] z-10 relative">
            <NavBar
                title="AI 어시스턴트"
                hideLeftIcon={false}
                showMenu={false}
                onNewChatClick={handleNewChat}
                iconNames={{
                    backIcon: "뒤로가기",
                    editIcon: "편집"
                }}
                rightIcons={['edit']}
            />

            <div className="w-full primary-info-text mb-4">
                <InfoText title="AI와 함께 원하는" subtitle="데이터를 찾아 보세요." />
            </div>

            <div className="w-[350px] h-[554px] mt-[30px] mb-[20px] rounded-[16.5px] flex flex-col overflow-y-auto relative">
                {messages.map((msg, index) => (
                    <ChatMessage key={index} sender={msg.sender} text={msg.text} />
                ))}

                {!isListening && messages.length === 0 && (
                    <div className="flex mt-auto overflow-x-auto whitespace-nowrap">
                        {buttons.map((text, index) => (
                            <div key={index} className="inline-block mr-[20px]">
                                <div className="hover:border-gradient w-[130px] h-[67px] rounded-[16.5px] flex items-center justify-center relative group">
                                    <button
                                        className="w-full h-full bg-[#262A34] rounded-[14.5px] flex justify-center items-center relative overflow-hidden"
                                        onClick={() => handleButtonClick(text)}
                                    >
                                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                        <div className="w-[95px] h-auto font-bold text-white text-[14px] text-left whitespace-normal z-10">
                                            {text}
                                        </div>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {isListening && (
                    <VoiceRecognitionBar
                        isListening={isListening}
                        duration={60}
                        transcript={transcript}
                        startTime={startTime}
                        onCancel={() => {
                            stopRecognition();
                            setInputText('');
                        }}
                        onComplete={async (text: string) => {
                            if (transcript.trim() !== '') {
                                stopRecognition();
                                addMessage('user', transcript);
                                await fetchAndAddAIResponse(transcript);
                            }
                        }}
                    />
                )}
            </div>

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