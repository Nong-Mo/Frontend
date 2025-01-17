import React, {useState} from 'react';
import {FaRobot} from 'react-icons/fa';
import {Search, X} from 'lucide-react';
import {Dialog} from '@headlessui/react';

interface ChatMessageProps {
    sender: string;
    text: string;
}

const parseMarkdown = (text: string): string => {
    let processedText = text;
    
    // 먼저 볼드체로 감싸진 따옴표 텍스트를 처리
    processedText = processedText.replace(
        /\*\*"([^"]+)"\*\*/g, 
        '<strong class="font-bold text-blue-500 text-[1em]">"$1"</strong>'
    );

    // 나머지 마크다운 처리
    return processedText
        // Code blocks with relative padding
        .replace(/```([^`]+)```/g, '<pre class="bg-gray-100 p-2 rounded my-2 overflow-x-auto text-[1em]">$1</pre>')
        // Inline code
        .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded text-[1em]">$1</code>')
        // Regular bold (not quotes)
        .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-white text-[1em]">$1</strong>')
        // Italic
        .replace(/\*([^*]+)\*/g, '<em class="italic text-[1em]">$1</em>')
        // Headers with relative sizes
        .replace(/#{3} ([^\n]+)/g, '<h3 class="font-bold my-2 text-[1.1em]">$1</h3>')
        .replace(/#{2} ([^\n]+)/g, '<h2 class="font-bold my-3 text-[1.2em]">$1</h2>')
        .replace(/# ([^\n]+)/g, '<h1 class="font-bold my-4 text-[1.3em]">$1</h1>')
        // List items
        .replace(/^\s*[-*+]\s+([^\n]+)/gm, '<li class="ml-2 text-[1em]">$1</li>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-500 hover:underline text-[1em]">$1</a>')
        // Line breaks
        .replace(/\n/g, '<br />');
};

const ChatMessage: React.FC<ChatMessageProps> = ({sender, text}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isAI = sender === "ai";

    return (
        <>
            <div
                className={`mb-[20px] rounded-[16.5px] flex ${
                    isAI ? "items-start" : "items-end"
                } ${isAI ? "self-start" : "self-end"}`}
            >
                {isAI && (
                    <div className="w-[27px] h-[27px] flex-shrink-0 flex items-center justify-center mr-3">
                        <FaRobot className="text-white w-full h-full"/>
                    </div>
                )}
                <div>
                    <div
                        className={`rounded-[16.5px] flex items-center justify-center space-x-2 ${
                            isAI
                                ? "bg-[#252934] text-white"
                                : "bg-[#246BFD] text-white"
                        } text-[14px] font-bold leading-[20px]`}
                        style={{
                            wordBreak: "break-word",
                            width: 'auto',
                            minWidth: 'auto'
                        }}
                    >
                        <div
                            className="text-[18px] font-bold p-[14px] leading-tight"
                            dangerouslySetInnerHTML={{__html: parseMarkdown(text)}}
                        />
                    </div>
                    <button
                        disabled={!isAI}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsModalOpen(true);
                        }}
                        className={`w-6 h-6 rounded-full  
                        flex items-center justify-center
                        transition-all mr-2 flex-shrink-0 ${isAI ? '' : 'opacity-0'}`}
                    >
                        <Search className="w-5 h-5 mt-[5px] text-white"/>
                    </button>
                </div>
            </div>

            <Dialog
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black bg-opacity-30" aria-hidden="true"/>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-[320px] h-[600px] overflow-y-auto [&::-webkit-scrollbar]:hidden bg-[#181a20] rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <Dialog.Title className={`text-lg font-medium ${isAI ? "text-[#246BFD]" : "text-gray-800"}`}>
                                    {isAI ? "AI 응답" : "사용자 메시지"}
                                </Dialog.Title>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-500 hover:text-[#246BFD] transition-all"
                                >
                                    <X className="w-6 h-6"/>
                                </button>
                            </div>
                            <div
                                className="text-[1.8em] leading-relaxed whitespace-pre-wrap text-white"
                                dangerouslySetInnerHTML={{__html: parseMarkdown(text)}}
                            />
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </>
    );
};

export default ChatMessage;