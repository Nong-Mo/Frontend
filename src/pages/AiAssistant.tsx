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

/**
 * AI 어시스턴트 페이지 컴포넌트
 * @component
 */
const AIAssistantPage: React.FC = () => {
    // useReducer를 사용하여 상태와 디스패치 함수를 생성
    const [state, dispatch] = useReducer(aiAssistantReducer, initialState);

    // 음성 인식 훅을 사용하여 음성 인식 관련 상태와 함수들을 가져옴
    const {
        isListening,
        startRecognition,
        stopRecognition,
        transcript,
        startTime
    } = useVoiceRecognition((text) => {
        // 음성 인식 결과를 디스패치하고 AI 응답을 가져옴
        dispatch({ type: 'ADD_MESSAGE', payload: { sender: 'user', text } });
        fetchAndAddAIResponse(text);
    });

    // 음성 합성 훅을 사용하여 텍스트를 음성으로 변환하는 함수 가져옴
    const { speakText } = useSpeechSynthesis();

    // 버튼 텍스트 배열
    const buttons = [
        "마지막으로 열어 본 파일을 보여줘",
        "A2D 서비스 사용 방법을 알려줘",
        "내 보관함 통계를 보여줘"
    ];

    /**
     * AI 응답을 가져와서 상태에 추가하는 함수
     * @param {string} userText - 사용자가 입력한 텍스트
     */
    const fetchAndAddAIResponse = async (userText: string) => {
        // 로딩 상태로 설정
        dispatch({ type: 'SET_LOADING', payload: true });

        try {
            // AI 응답을 가져옴
            const aiResponse = await fetchAIResponse(userText);
            // AI 응답을 상태에 추가
            dispatch({ type: 'ADD_MESSAGE', payload: { sender: 'ai', text: aiResponse } });
            // AI 응답을 음성으로 변환하여 재생
            speakText(aiResponse);
        } catch (error) {
            console.error('Error fetching AI response:', error);
        } finally {
            // 로딩 상태 해제
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    /**
     * 메시지 전송 핸들러
     */
    const handleSend = async () => {
        // 입력된 텍스트가 없으면 반환
        if (!state.inputText.trim()) return;

        // 사용자 메시지를 상태에 추가
        dispatch({ type: 'ADD_MESSAGE', payload: { sender: 'user', text: state.inputText } });
        // 입력 텍스트 초기화
        dispatch({ type: 'SET_INPUT_TEXT', payload: '' });

        // AI 응답을 가져와서 추가
        await fetchAndAddAIResponse(state.inputText);
    };

    /**
     * 새로운 채팅 시작 핸들러
     */
    const handleNewChat = () => {
        // 상태 초기화
        dispatch({ type: 'RESET' });
    };

    /**
     * 버튼 클릭 핸들러
     * @param {string} text - 버튼 텍스트
     */
    const handleButtonClick = async (text: string) => {
        // 버튼 텍스트를 사용자 메시지로 추가
        dispatch({ type: 'ADD_MESSAGE', payload: { sender: 'user', text } });
        // AI 응답을 가져와서 추가
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
                                            className="w-[95px] h-auto font-bold text-white text-[14px] text-left whitespace-normal z-10">
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
                        startTime={startTime}  // startTime prop 전달
                        onCancel={() => {
                            stopRecognition();
                            dispatch({ type: 'SET_INPUT_TEXT', payload: '' });
                        }}
                        onComplete={async (text: string) => {
                            if (transcript.trim() !== '') {
                                stopRecognition();
                                dispatch({ type: 'ADD_MESSAGE', payload: { sender: 'user', text: transcript }});
                                await fetchAndAddAIResponse(transcript);
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