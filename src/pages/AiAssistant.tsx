import React, { useReducer } from 'react';
import { NavBar } from "../components/common/NavBar.tsx";
import InfoText from "../components/common/InfoText.tsx";
import ChatMessage from "../components/ai_assistants/ChatMessage.tsx";
import ChatInput from "../components/ai_assistants/ChatInput.tsx";
import useVoiceRecognition from "../hooks/useVoiceRecognition";
import useSpeechSynthesis from "../hooks/useSpeechSynthesis";
import VoiceRecognitionBar from "../components/ai_assistants/VoiceRecognitionBar.tsx";
import { aiAssistantReducer, initialState } from '../reducers/aiAssistantReducer';
import { fetchAIResponse } from '../api/ai';

const AIAssistantPage: React.FC = () => {
    const [state, dispatch] = useReducer(aiAssistantReducer, initialState);
    const { startRecognition, isListening, stopRecognition } = useVoiceRecognition((text) => {
        dispatch({ type: 'ADD_MESSAGE', payload: { sender: 'user', text } });
        fetchAndAddAIResponse(text);
    });
    const { speakText } = useSpeechSynthesis();

    const buttons = [
        "마지막으로 열어 본 파일을 보여줘",
        "A2D 서비스 사용 방법을 알려줘",
        "내 보관함 통계를 보여줘"
    ];

    const fetchAndAddAIResponse = async (userText: string) => {
        dispatch({ type: 'SET_LOADING', payload: true });

        try {
            const aiResponse = await fetchAIResponse(userText);
            dispatch({ type: 'ADD_MESSAGE', payload: { sender: 'ai', text: aiResponse } });
            speakText(aiResponse);
        } catch (error) {
            console.error('Error fetching AI response:', error);
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const handleSend = async () => {
        if (!state.inputText.trim()) return;

        dispatch({ type: 'ADD_MESSAGE', payload: { sender: 'user', text: state.inputText } });
        dispatch({ type: 'SET_INPUT_TEXT', payload: '' });

        await fetchAndAddAIResponse(state.inputText);
    };

    const handleNewChat = () => {
        dispatch({ type: 'RESET' });
    };

    const handleButtonClick = async (text: string) => {
        dispatch({ type: 'ADD_MESSAGE', payload: { sender: 'user', text } });
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
                {state.messages.map((msg, index) => (
                    <ChatMessage key={index} sender={msg.sender} text={msg.text} />
                ))}

                {!isListening && state.messages.length === 0 && (
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

                {isListening && (
                    <VoiceRecognitionBar
                        isListening={isListening}
                        duration={60}
                        transcript={state.inputText} // 현재 음성 인식 결과
                        onCancel={() => {
                            stopRecognition();
                        }}
                        onComplete={async (transcript: string) => {
                            stopRecognition();
                            dispatch({ type: 'ADD_MESSAGE', payload: { sender: 'user', text: transcript } });

                            // AI 응답 추가
                            try {
                                const aiResponse = await fetchAIResponse(transcript);
                                dispatch({ type: 'ADD_MESSAGE', payload: { sender: 'ai', text: aiResponse } });
                                speakText(aiResponse);
                            } catch (error) {
                                console.error('Error fetching AI response:', error);
                            }
                        }}
                    />
                )}
            </div>

            <ChatInput
                inputText={state.inputText}
                setInputText={(text) => dispatch({ type: 'SET_INPUT_TEXT', payload: text })}
                onSend={handleSend}
                onStartVoiceRecognition={startRecognition}
                isListening={isListening}
            />
        </div>
    );
};

export default AIAssistantPage;