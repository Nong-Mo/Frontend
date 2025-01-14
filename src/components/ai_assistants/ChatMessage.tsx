import React, {useState} from 'react';
import {FaRobot} from 'react-icons/fa';
import {Search, X} from 'lucide-react';
import {Dialog} from '@headlessui/react';

interface ChatMessageProps {
    sender: string;
    text: string;
    onClickChat: () => void;
}

const parseMarkdown = (text: string): string => {
    return text
        .replace(/```([^`]+)```/g, '<pre class="bg-gray-100 p-2 rounded my-2 overflow-x-auto">$1</pre>')
        .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold">$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>')
        .replace(/#{3} ([^\n]+)/g, '<h3 class="text-lg font-bold my-2">$1</h3>')
        .replace(/#{2} ([^\n]+)/g, '<h2 class="text-xl font-bold my-3">$1</h2>')
        .replace(/# ([^\n]+)/g, '<h1 class="text-2xl font-bold my-4">$1</h1>')
        .replace(/^\s*[-*+]\s+([^\n]+)/gm, '<li class="ml-4">$1</li>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-500 hover:underline">$1</a>')
        .replace(/\n/g, '<br />');
};

const ChatMessage: React.FC<ChatMessageProps> = ({sender, text, onClickChat}) => {
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
                            className="text-[14px] font-bold leading-[20px] p-[14px]"
                            dangerouslySetInnerHTML={{__html: parseMarkdown(text)}}
                            onClick={onClickChat}
                        />
                    </div>
                    <button
                        disabled={!isAI}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsModalOpen(true);
                        }}
                        className={`w-6 h-6 rounded-full bg-black bg-opacity-20 
                        flex items-center justify-center hover:bg-opacity-30 
                        transition-all mr-2 flex-shrink-0 ${isAI ? '' : 'opacity-0'}`}
                    >
                        <Search className="w-3 h-3 text-white"/>
                    </button>
                </div>
            </div>

            <Dialog
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black bg-opacity-30"
                     aria-hidden="true"/>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-[320px] max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden bg-white rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <Dialog.Title className={`text-lg font-medium ${isAI ? "text-[#246BFD]" : "text-gray-800"}`}>
                                    {isAI ? "AI 응답" : "사용자 메시지"}
                                </Dialog.Title>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X className="w-6 h-6"/>
                                </button>
                            </div>
                            <div
                                className="text-xl leading-relaxed whitespace-pre-wrap text-gray-800"
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