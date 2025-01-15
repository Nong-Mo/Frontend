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
import LoadingDots from '../components/ai_assistants/LoadingDots.tsx';

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
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [lastMessageId, setLastMessageId] = useState<string | null>(null);

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

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

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
            // new_chat: false로 설정하여 이전 대화 컨텍스트 유지
            const response = await fetchAIResponse(userText, false);
    
            switch (response?.type) {
                case 'file_found':
                    /**
                     * 파일 검색 결과가 있는 경우
                     * response.data.files 배열에 여러 파일이 있을 수 있으므로
                     * UI에 맞춰 처리하면 됩니다.
                     */
                    if (response.data?.files?.length) {
                        // 여러 파일 중 첫 번째 정보를 저장 예시
                        const firstFile = response.data.files[0];
                        setSavedFileInfo({
                            fileId: firstFile.file_id,
                            title: firstFile.title,
                            storage: '' // 필요하면 백엔드에서 storage_type도 함께 넘기도록 수정
                        });
                    }
                    addMessage('ai', response.message);
                    speakText(response.message);
                    break;
    
                case 'no_results':
                    /**
                     * 검색 결과가 없는 경우 또는 연관된 파일을 찾지 못한 경우
                     * 백엔드에서 가까운 제목 추천(suggestions)을 줄 수도 있으니 활용 가능
                     */
                    addMessage('ai', response.message);
                    speakText(response.message);
                    break;
    
                case 'story_save_ready':
                    /**
                     * 백엔드가 "저장 준비(story_save_ready)"라고 응답한 경우
                     * 마지막 생성된 이야기를 저장할 건지 확인하는 안내 메시지
                     */
                    addMessage('ai', response.message);
                    speakText(response.message);
    
                    // 백엔드에서 넘어온 message_id 등을 저장해두어야 나중에 saveStory 요청 시 활용 가능
                    const msgId = response.data?.message_id || null;
                    setLastMessageId(msgId);
    
                    // 필요한 경우 모달 자동 표시
                    // setIsSaveModalOpen(true);
                    break;
    
                case 'error':
                    /**
                     * 백엔드 처리 중 오류가 발생한 경우
                     */
                    addMessage('ai', response.message);
                    speakText(response.message);
                    break;

                case 'analysis':
                    /**
                     * 분석 응답
                     */
                    addMessage('ai', response.message);
                    speakText(response.message);
                    break;
                
                case 'summary':
                    /**
                     * 요약 응답
                     */
                    addMessage('ai', response.message);
                    speakText(response.message);
                    break;

                case 'review':
                    /**
                     * 서평 응답
                     */
                    addMessage('ai', response.message);
                    speakText(response.message);
                    break;

                case 'blog':
                    /**
                     * 블로그 응답
                     */
                    addMessage('ai', response.message);
                    speakText(response.message);
                    break;
    
                case 'chat':
                    /**
                     * 일반 대화 응답
                     * 검색/저장/뒷이야기 등의 특별한 분기가 아닐 때 기본적으로 'chat' 타입으로 내려옵니다.
                     */
                    addMessage('ai', response.message);
                    speakText(response.message);
                    break;
    
                default:
                    /**
                     * 혹시 예상치 못한 type이 넘어온 경우에 대비한 처리
                     */
                    console.warn('Unhandled response type:', response?.type);
                    addMessage('ai', response.message || '알 수 없는 응답 타입입니다.');
                    speakText(response.message || '알 수 없는 응답 타입입니다.');
                    break;
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

            if (fileDetail.fileType === 'audio') {
                navigate(`/player/book/audio/${fileDetail.fileID}`);
            } else if (fileDetail.fileType === 'pdf') {
                navigate(`/player/pdf/view/${fileId}`);
            }
        } catch (error) {
            console.error('File navigation error:', error);
            addMessage('ai', '파일을 찾을 수 없거나 접근할 수 없습니다.');
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
        <div className="w-full flex flex-col min-h-screen z-10 mt-[15px]">
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

            <div className="w-full flex flex-col items-center">
                <div className="w-[350px] primary-info-text mb-4">
                    <InfoText title="AI와 함께 원하는" subtitle="데이터를 찾아 보세요." />
                </div>

                <div ref={chatContainerRef} id="chat-container" className="w-[350px] h-[554px] mt-[30px] mb-[12px] flex flex-col overflow-y-auto relative [&::-webkit-scrollbar]:hidden">
                    {messages.map((msg, index) => (
                        <div key={index}
                             className={`mb-[20px] ${msg.sender === 'ai' ? 'self-start' : 'self-end'}`}>
                            <ChatMessage sender={msg.sender}
                                         text={msg.text}/>
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
                                                                    switch (savedFileInfo.storage) {
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
                                                                onClick={async () => await handleFileNavigation(savedFileInfo.fileId, savedFileInfo.storage)}
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
                                                                onClick={async () => await handleFileNavigation(savedFileInfo.fileId, savedFileInfo.storage)}
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
                    {isLoading && <LoadingDots />}
                    {!isListening && messages.length === 0 && (
                        <div className="flex mt-auto overflow-x-auto whitespace-nowrap">
                            {buttons.map((text, index) => (
                                <div key={index}
                                     className="inline-block mr-[20px]">
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
            </div>

            <div className="w-full flex flex-col items-center">
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
                    if (!lastMessageId) {
                        console.error('No last message ID found.'); 
                        addMessage('ai', '저장할 메시지 ID가 없습니다.');
                        return;
                    }

                    // message_id를 같이 전달
                    const response = await saveStory({
                        title,
                        storage_name,
                        message_id: lastMessageId
                    });

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
        </div>
    );
};

export default AIAssistantPage;