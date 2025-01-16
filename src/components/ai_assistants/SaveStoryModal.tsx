import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa'; // 아래 화살표 아이콘

interface SaveStoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (title: string, storage: string) => Promise<void>;
}

const SaveStoryModal: React.FC<SaveStoryModalProps> = ({ isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [storage, setStorage] = useState(''); // 기본값은 빈 문자열
    const [isLoading, setIsLoading] = useState(false);

    const storageOptions = ['영감', '소설', '블로그', '서평', '메모', '일기'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !storage) return;

        setIsLoading(true);
        try {
            await onSave(title, storage);
            onClose();
        } catch (error) {
            console.error('Failed to save story:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#262A34] rounded-[16.5px] p-6 w-[350px] transform translate-y-0">
                <h2 className="text-white lex text-[25px] font-bold mb-4">파일로 저장하기</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-white text-[17.5px] font-bold mb-2">
                            파일 제목
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-3 bg-[#181A20] text-white text-[15px] font-bold rounded-[16.5px] focus:outline-none placeholder:text-[14.5px] placeholder:font-bold"
                            placeholder="파일 제목을 입력하세요."
                            disabled={isLoading}
                        />
                    </div>
                    <div className="mb-4 relative">
                        <label className="block text-white text-[17.5px] font-bold mb-2">
                            저장할 보관함
                        </label>
                        <div className="relative">
                            <select
                                value={storage}
                                onChange={(e) => setStorage(e.target.value)}
                                className="w-full px-3 py-3 bg-[#181A20] text-white text-[15px] font-bold rounded-[16.5px] focus:outline-none appearance-none pr-10"
                                disabled={isLoading}
                                style={{
                                    color: storage === "" ? "#5E6272" : "white",
                                }}
                            >
                                <option value="" disabled>
                                    보관함을 선택해 주세요.
                                </option>
                                {storageOptions.map(option => (
                                    <option key={option} value={option} className="text-gray-300 text-[15px] font-bold">
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                <FaChevronDown className="text-white text-[15px]"/>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-white font-bold text-[15px] hover:bg-[#1C1F27] rounded-[16.5px]"
                            disabled={isLoading}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#246BFD] text-white text-[15px] font-bold rounded-[16.5px] hover:opacity-90"
                            disabled={isLoading}
                        >
                            저장
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default SaveStoryModal;
