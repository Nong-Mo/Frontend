import React, { useState } from 'react';
import { NavBar } from "../components/common/NavBar.tsx";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/constants.ts";
import InfoText from "../components/common/InfoText.tsx";
import ChatMessage from "../components/ai_assistants/ChatMessage.tsx";
import ChatInput from "../components/ai_assistants/ChatInput.tsx";
import useVoiceRecognition from "../hooks/useVoiceRecognition";
import useSpeechSynthesis from "../hooks/useSpeechSynthesis";
import VoiceRecognitionBar from "../components/ai_assistants/VoiceRecognitionBar.tsx";
import { fetchAIResponse, startNewChat, saveStory } from '../api/ai';
import SaveStoryModal from '../components/ai_assistants/SaveStoryModal';

interface Message {
    sender: string;
    text: string;
}

const AIAssistantPage: React.FC = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [savedFileInfo, setSavedFileInfo] = useState<{fileId: string, title: string, storage: string} | null>(null);

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

    const addMessage = (sender: string, text: string) => {
        setMessages(prev => [...prev, { sender, text }]);
    };

    const fetchAndAddAIResponse = async (userText: string) => {
        setIsLoading(true);
        try {
            const response = await fetchAIResponse(userText);
            if (response?.type === 'chat') {
                addMessage('ai', response.message);
                speakText(response.message);
            }
        } catch (error) {
            console.error('Error fetching AI response:', error);
            addMessage('ai', '죄송합니다. 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async () => {
        if (!inputText.trim() || isLoading) return;

        addMessage('user', inputText);
        setInputText('');
        await fetchAndAddAIResponse(inputText);
    };

    const isFileRequest = (text: string) => {
        const keywords = ['파일로 만들어', '파일로 저장', '파일 만들어'];
        return keywords.some(keyword => text.toLowerCase().includes(keyword));
    };

    const handleFileNavigation = async (fileId: string, storage: string) => {
        try {
            const fileDetail = await getFileDetail(fileId);

            let targetUrl: string;
            if (storage === '책' && fileDetail.relatedFile) {
                targetUrl = fileDetail.relatedFile.fileUrl;
            } else {
                targetUrl = fileDetail.fileUrl;
            }

            window.location.href = targetUrl;
        } catch (error) {
            console.error('Error navigating to file:', error);
            addMessage('ai', '파일 위치로 이동하는 중 오류가 발생했습니다.');
        }
    };

    const handleNewChat = async () => {
        try {
            const success = await startNewChat();
            if (success) {
                setMessages([]);
                setInputText('');
                setIsLoading(false);
            } else {
                console.error('Failed to start new chat');
            }
        } catch (error) {
            console.error('Error starting new chat:', error);
        }
    };

    const handleButtonClick = async (text: string) => {
        if (isLoading) return;
        addMessage('user', text);
        await fetchAndAddAIResponse(text);
    };

    return (
        <div className="w-full h-[817px] mt-[15px] flex flex-col px-[32px] z-10 relative">
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
                    <div key={index} className={`mb-[20px] ${msg.sender === 'ai' ? 'self-start' : 'self-end'}`}>
                        <ChatMessage sender={msg.sender} text={msg.text} />
                        {msg.sender === 'ai' &&
                            index === messages.length - 1 &&
                            (isFileRequest(messages[messages.length - 2]?.text || '') ||
                                msg.text.includes('파일이 성공적으로 저장되었습니다')) && (
                                <div className="mt-2">
                                    {savedFileInfo ? (
                                        <div className="flex space-x-2 ml-12">
                                            <div className="w-[130px] h-[35px] rounded-[16.5px] flex items-center justify-center relative">
                                                <button
                                                    onClick={() => {
                                                        switch(savedFileInfo.storage) {
                                                            case '책':
                                                                navigate(ROUTES.LIBRARY.BOOK.path);
                                                                break;
                                                            case '영수증':
                                                                navigate(ROUTES.LIBRARY.RECEIPT.path);
                                                                break;
                                                            case '굿즈':
                                                                navigate(ROUTES.GOODS.STORAGE.path);
                                                                break;
                                                            case '필름 사진':
                                                                // 경로가 아직 정의되지 않았다면 임시로 에러 로깅
                                                                console.error('필름 사진 보관함 경로가 정의되지 않았습니다.');
                                                                break;
                                                            case '서류':
                                                                // 경로가 아직 정의되지 않았다면 임시로 에러 로깅
                                                                console.error('서류 보관함 경로가 정의되지 않았습니다.');
                                                                break;
                                                            case '티켓':
                                                                // 경로가 아직 정의되지 않았다면 임시로 에러 로깅
                                                                console.error('티켓 보관함 경로가 정의되지 않았습니다.');
                                                                break;
                                                            default:
                                                                console.error('알 수 없는 보관함 타입:', savedFileInfo.storage);
                                                        }
                                                    }}
                                                    className="w-full h-full bg-[#262A34] rounded-[14.5px] flex justify-center items-center relative overflow-hidden"
                                                >
                                                    <div className="font-bold text-white text-[14px] text-center whitespace-normal">
                                                        보관함으로 이동
                                                    </div>
                                                </button>
                                            </div>
                                            <div className="w-[130px] h-[35px] rounded-[16.5px] flex items-center justify-center relative">
                                                <button
                                                    onClick={() => handleFileNavigation(savedFileInfo.fileId, savedFileInfo.storage)}
                                                    className="w-full h-full bg-[#262A34] rounded-[14.5px] flex justify-center items-center relative overflow-hidden"
                                                >
                                                    <div className="font-bold text-white text-[14px] text-center whitespace-normal">
                                                        파일 감상하기
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-[130px] h-[35px] rounded-[16.5px] flex items-center justify-center relative ml-12">
                                            <button
                                                onClick={() => setIsSaveModalOpen(true)}
                                                className="w-full h-full bg-[#262A34] rounded-[14.5px] flex justify-center items-center relative overflow-hidden"
                                                disabled={isLoading}
                                            >
                                                <div className="font-bold text-white text-[14px] text-center whitespace-normal">
                                                    저장하기
                                                </div>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                    </div>
                ))}

                {!isListening && messages.length === 0 && (
                    <div className="flex mt-auto overflow-x-auto whitespace-nowrap">
                        {buttons.map((text, index) => (
                            <div key={index} className="inline-block mr-[20px]">
                                <div className="hover:border-gradient w-[130px] h-[67px] rounded-[16.5px] flex items-center justify-center relative group">
                                    <button
                                        className="w-full h-full bg-[#262A34] rounded-[14.5px] flex justify-center items-center relative overflow-hidden"
                                        onClick={() => handleButtonClick(text)}
                                        disabled={isLoading}
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

            <SaveStoryModal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                onSave={async (title, storage_name) => {
                    try {
                        const response = await saveStory({ title, storage_name });
                        if (response?.status === 'success') {
                            setSavedFileInfo({
                                fileId: response.file_id,
                                title: title,
                                storage: storage_name
                            });
                            setIsSaveModalOpen(false);
                            addMessage('ai', `'${title}' 파일이 성공적으로 저장되었습니다. 아래 버튼을 클릭하여 파일로 이동할 수 있습니다.`);
                        }
                    } catch (error) {
                        console.error('Failed to save story:', error);
                        addMessage('ai', '파일 저장 중 오류가 발생했습니다.');
                    }
                }}
            />
        </div>
    );
};

export default AIAssistantPage;