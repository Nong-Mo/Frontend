import React, { useState } from 'react';

interface SaveStoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (title: string, storage: string) => Promise<void>;
}

const SaveStoryModal: React.FC<SaveStoryModalProps> = ({ isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [storage, setStorage] = useState('책');
    const [isLoading, setIsLoading] = useState(false);

    const storageOptions = ['책', '영수증', '굿즈', '필름 사진', '서류', '티켓'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

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
            <div className="bg-[#262A34] rounded-[16.5px] p-6 w-[350px]">
                <h2 className="text-white text-lg font-bold mb-4">대화 내용 저장하기</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-white text-sm font-bold mb-2">
                            제목
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 bg-[#1C1F27] text-white rounded-lg focus:outline-none"
                            placeholder="제목을 입력하세요"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-white text-sm font-bold mb-2">
                            저장할 보관함
                        </label>
                        <select
                            value={storage}
                            onChange={(e) => setStorage(e.target.value)}
                            className="w-full px-3 py-2 bg-[#1C1F27] text-white rounded-lg focus:outline-none"
                            disabled={isLoading}
                        >
                            {storageOptions.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-white font-bold hover:bg-[#1C1F27] rounded-lg"
                            disabled={isLoading}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#246BFD] text-white font-bold rounded-lg hover:opacity-90"
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