import React, { useState } from 'react';
import { Trash2, ZoomIn, Camera, X } from 'lucide-react';

interface Photo {
    id: string;
    data: string;
}

interface ScanViewerProps {
    photos: Photo[];
    onRemove: (id: string) => void;
    type: 'book' | 'receipt'; // 문서 또는 영수증 타입
}

export const ScanViewer: React.FC<ScanViewerProps> = ({
    photos,
    onRemove,
    type
}) => {
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    // 타입에 따른 텍스트 설정
    const getText = () => {
        if (type === 'receipt') {
            return {
                title: '영수증을 스캔합니다',
                count: `총 ${photos.length}개의 영수증이 스캔되었습니다`,
                empty: '스캔된 영수증이 없습니다',
                guide: '카메라로 영수증을 스캔해주세요',
                pageLabel: '영수증'
            };
        }
        if (type === 'book') {
            return {
                title: '책을 스캔합니다',
                count: `총 ${photos.length}장의 페이지가 스캔되었습니다`,
                empty: '스캔된 페이지가 없습니다',
                guide: '카메라로 책의 페이지를 스캔해주세요',
                pageLabel: '책'
            };
        }
        return {
            title: '문서를 스캔합니다',
            count: `총 ${photos.length}장의 페이지가 스캔되었습니다`,
            empty: '스캔된 페이지가 없습니다',
            guide: '카메라로 문서의 페이지를 스캔해주세요',
            pageLabel: '페이지'
        };
    };

    const text = getText();

    return (
        <>
            <div className="w-full h-[615px] relative rounded-3xl overflow-hidden">
                {/* 헤더 */}
                <div className="absolute top-0 left-0 right-0 z-10 bg-[#181A20]">
                    <div className="py-5 px-4">
                        <h1 className="text-[35px] text-white font-semibold mb-1">
                            {text.title}
                        </h1>
                        {photos.length > 0 && (
                            <p className="text-[17.5px] text-neutral-400">
                                {text.count}
                            </p>
                        )}
                    </div>
                </div>

                {photos.length > 0 ? (
                    <div className="w-full h-full overflow-y-auto custom-scrollbar pt-32 pb-6">
                        <div className="space-y-3">
                            {photos.map((photo, index) => (
                                <div
                                    key={photo.id}
                                    className="relative group animate-fadeIn"
                                    onMouseEnter={() => setHoveredId(photo.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                >
                                    {/* 페이지 카드 */}
                                    <div className="relative overflow-hidden rounded-2xl
                                        bg-[#262A34] hover:bg-[#2d3341] shadow-lg
                                        transition-all duration-300">
                                        <div className="p-4">
                                            <div className="flex items-center gap-4">
                                                {/* 미리보기 */}
                                                <div className="relative aspect-[3/4] w-20 rounded-lg overflow-hidden
                                                    bg-black/40 cursor-pointer shadow-lg"
                                                    onClick={() => setSelectedPhoto(photo)}>
                                                    <img
                                                        src={photo.data}
                                                        alt={`스캔된 ${text.pageLabel} ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                {/* 정보 & 액션 */}
                                                <div className="flex flex-1 justify-between items-center">
                                                    <span className="text-white font-medium">
                                                        {text.pageLabel} {index + 1}
                                                    </span>

                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={() => setSelectedPhoto(photo)}
                                                            className="p-2 text-neutral-400 hover:text-white
                                                                hover:bg-white/10 rounded-lg transition-all duration-200"
                                                            aria-label={`${text.pageLabel} 확대`}
                                                        >
                                                            <ZoomIn className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => onRemove(photo.id)}
                                                            className="p-2 text-neutral-400 hover:text-red-400
                                                                hover:bg-red-400/10 rounded-lg transition-all duration-200"
                                                            aria-label={`${text.pageLabel} 삭제`}
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center px-6 space-y-4">
                        <div className="p-6 bg-[#262A34] rounded-full">
                            <Camera className="w-10 h-10 text-neutral-400" />
                        </div>
                        <div className="text-center space-y-2">
                            <p className="text-lg font-medium text-white">
                                {text.empty}
                            </p>
                            <p className="text-sm text-neutral-400 max-w-sm">
                                {text.guide}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* 확대 모달 */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-8"
                    onClick={() => setSelectedPhoto(null)}
                >
                    <div
                        className="relative max-w-3xl w-full aspect-[3/4] bg-[#1A1B1E]
                            rounded-3xl overflow-hidden shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="absolute top-4 right-4 z-10">
                            <button
                                onClick={() => setSelectedPhoto(null)}
                                className="p-2 text-neutral-400 hover:text-white
                                    hover:bg-white/10 rounded-lg transition-colors duration-200"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="w-full h-full p-6">
                            <img
                                src={selectedPhoto.data}
                                alt="확대된 이미지"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 0px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    border: 2px solid transparent;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(255, 255, 255, 0.2);
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </>
    );
};