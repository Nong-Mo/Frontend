import React, { useState, useRef, useEffect } from 'react';
import { NavBar } from "../components/common/NavBar.tsx";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/constants.ts";
import InfoText from "../components/common/InfoText.tsx";
import ChatMessage from "../components/ai_assistants/ChatMessage.tsx";
import ChatInput from "../components/ai_assistants/ChatInput.tsx";
import useVoiceRecognition from "../hooks/useVoiceRecognition";
import useSpeechSynthesis from "../hooks/useSpeechSynthesis";
import VoiceRecognitionBar from "../components/ai_assistants/VoiceRecognitionBar.tsx";
import SaveStoryModal from '../components/ai_assistants/SaveStoryModal';
import { fetchAIResponse, startNewChat, saveStory, getFileDetail } from '../api/ai';

interface Message {
    sender: string;
    text: string;
    fileInfo?: {
        fileId: string;
        title: string;
        storage: string;
    };
}

const AIAssistantPage: React.FC = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [savedFileInfo, setSavedFileInfo] = useState<{fileId: string, title: string, storage: string} | null>(null);

    // 2. 여기가 두번째 수정사항: messagesEndRef 추가
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { speakText } = useSpeechSynthesis();

    // 3. 여기가 세번째 수정사항: 스크롤 effect 추가
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

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

    const addMessage = (
        sender: string,
        text: string,
        fileInfo?: {
            fileId: string;
            title: string;
            storage: string;
        }
    ) => {
        setMessages(prev => [...prev, { sender, text, fileInfo }]);
    };

    // 메시지 타입 체크 함수
    const getMessageType = (userMessage: string, aiMessage: string) => {
        // 파일 저장 요청 키워드
        const saveKeywords = ['파일로 만들어', '파일로 저장', '파일 만들어'];

        // 파일 찾기/이동 요청 키워드
        const findMoveKeywords = ['파일 찾아줘', '파일 이동해줘', '파일로 이동해줘'];

        if (saveKeywords.some(keyword => userMessage.includes(keyword))) {
            return 'save_request';
        }

        if (findMoveKeywords.some(keyword => userMessage.includes(keyword))) {
            return 'find_request';
        }

        if (aiMessage.includes('파일이 성공적으로 저장되었습니다')) {
            return 'save_complete';
        }

        if (aiMessage.includes('파일을 찾았습니다')) {
            return 'find_complete';
        }

        return null;
    };

    const fetchAndAddAIResponse = async (userText: string) => {
        setIsLoading(true);
        try {
            const response = await fetchAIResponse(userText);

            if (response?.type === 'file_found') {
                // 파일을 찾은 경우
                if (response.data) {
                    setSavedFileInfo({
                        fileId: response.data.file_id,
                        title: response.data.title,
                        storage: response.data.storage_type || ''
                    });
                }
                addMessage('ai', response.message);
                speakText(response.message);
            } else if (response?.type === 'chat') {
                // 일반 채팅 응답
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

            // 관련 파일이 있고 오디오 파일인 경우, 오디오 파일 URL을 우선 사용
            if (fileDetail.relatedFile && fileDetail.relatedFile.fileType === 'audio') {
                targetUrl = fileDetail.relatedFile.fileUrl;
            }
            // 관련 파일이 있고 메인 파일이 PDF인 경우, 메인 파일 URL 사용
            else if (fileDetail.fileType === 'pdf') {
                targetUrl = fileDetail.fileUrl;
            }
            // 그 외의 경우, 기존 로직대로 처리
            else if (fileDetail.relatedFile) {
                targetUrl = fileDetail.relatedFile.fileUrl;
            }
            else {
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
                            index === messages.length - 1 && (
                                <div className="mt-1">
                                    {(() => {
                                        const prevUserMessage = messages[messages.length - 2]?.text || '';
                                        const messageType = getMessageType(prevUserMessage, msg.text);

                                        // 파일 저장 완료 시
                                        if (messageType === 'save_complete' && savedFileInfo) {
                                            return (
                                                <div className="flex flex-row space-x-2 ml-[40px]">
                                                    <div className="inline-block rounded-[16.5px]">
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
                                                                        console.error('필름 사진 보관함 경로가 정의되지 않았습니다.');
                                                                        break;
                                                                    case '서류':
                                                                        console.error('서류 보관함 경로가 정의되지 않았습니다.');
                                                                        break;
                                                                    case '티켓':
                                                                        console.error('티켓 보관함 경로가 정의되지 않았습니다.');
                                                                        break;
                                                                    default:
                                                                        console.error('알 수 없는 보관함 타입:', savedFileInfo.storage);
                                                                }
                                                            }}
                                                            className="w-full rounded-[16.5px] flex items-center justify-center bg-[#262A34] text-white text-[14px] font-bold leading-[20px]"
                                                        >
                                            <span className="text-[14px] font-bold leading-[20px] p-[14px]">
                                                보관함 이동
                                            </span>
                                                        </button>
                                                    </div>
                                                    <div className="inline-block rounded-[16.5px]">
                                                        <button
                                                            onClick={() => handleFileNavigation(savedFileInfo.fileId, savedFileInfo.storage)}
                                                            className="w-full rounded-[16.5px] flex items-center justify-center bg-[#262A34] text-white text-[14px] font-bold leading-[20px]"
                                                        >
                                            <span className="text-[14px] font-bold leading-[20px] p-[14px]">
                                                파일 감상
                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        // 파일 찾기/이동 완료 시
                                        if (msg.text.includes('파일을 찾았습니다')) {
                                            const fileInfo = savedFileInfo;
                                            return (
                                                <div className="ml-[40px]">
                                                    <div className="inline-block rounded-[16.5px]">
                                                        <button
                                                            onClick={() => fileInfo && handleFileNavigation(fileInfo.fileId, fileInfo.storage)}
                                                            className="w-full rounded-[16.5px] flex items-center justify-center bg-[#262A34] text-white text-[14px] font-bold leading-[20px]"
                                                            disabled={isLoading}
                                                        >
                                            <span className="text-[14px] font-bold leading-[20px] p-[14px]">
                                                파일 이동
                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        // 파일 저장 요청 시
                                        if (messageType === 'save_request') {
                                            return (
                                                <div className="ml-[40px]">
                                                    <div className="inline-block rounded-[16.5px]">
                                                        <button
                                                            onClick={() => setIsSaveModalOpen(true)}
                                                            className="w-full rounded-[16.5px] flex items-center justify-center bg-[#262A34] text-white text-[14px] font-bold leading-[20px]"
                                                            disabled={isLoading}
                                                        >
                                            <span className="text-[14px] font-bold leading-[20px] p-[14px]">
                                                파일 저장
                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return null;
                                    })()}
                                </div>
                            )}
                    </div>
                ))}

                {/* 4. 여기가 네번째 수정사항: 스크롤 기준점 추가 */}
                <div ref={messagesEndRef} />

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