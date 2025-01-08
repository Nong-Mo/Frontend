import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

interface PhotoFile {
    id: string;
    data: string;
    vertices?: {
        x: number;
        y: number;
    }[];
}

interface BookConvertModalProps {
    photos: PhotoFile[];
    onClose: () => void;
    onUpload: (photos: PhotoFile[], title: string) => Promise<boolean>;
    onComplete: () => void;
    isLoading: boolean;
}

const BookConvertModal: React.FC<BookConvertModalProps> = ({
                                                                photos,
                                                                onClose,
                                                                onUpload,
                                                                onComplete,
                                                                isLoading,
                                                            }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState<number>(1);
    const [bookTitle, setBookTitle] = useState<string>("");
    const [progress, setProgress] = useState<number>(0);

    const resetModal = () => {
        setStep(1);
        setBookTitle("");
        setProgress(0);
    };

    const handleClose = () => {
        onClose();
        setTimeout(resetModal, 300);
    };

    useEffect(() => {
        if (step === 2) {
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 180) {
                        clearInterval(interval);
                        return 180;
                    }
                    return prev + 1;
                });
            }, 15);

            return () => clearInterval(interval);
        }
    }, [step]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBookTitle(e.target.value);
    };

    const handleConvert = async () => {
        if (!bookTitle) return;
        setStep(2);

        try {
            // vertices 정보와 함께 photos 로그 출력
            console.log('Photos with vertices:', photos.map(photo => ({
                id: photo.id,
                hasVertices: !!photo.vertices,
                verticesData: photo.vertices
            })));

            // bookTitle을 onUpload 함수에 전달
            const uploadResult = await onUpload(photos, bookTitle);

            // 업로드 시도할 데이터 구조 확인
            console.log('Upload payload:', {
                title: bookTitle,
                photos: photos.map(photo => ({
                    id: photo.id,
                    data: photo.data.substring(0, 50) + '...', // 데이터는 길어서 축약
                    vertices: photo.vertices
                }))
            });

            if (uploadResult) {
                setStep(3);
                // 성공 시 최종 상태 로그
                console.log('Upload successful!', {
                    title: bookTitle,
                    photoCount: photos.length,
                    photosWithVertices: photos.filter(p => p.vertices).length
                });
            } else {
                setStep(1);
                console.log('Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            setStep(1);
        }
    };

    const renderStep1 = () => (
        <div className="w-full">
            <div className="mx-[14px] my-[42px] flex items-center flex-col">
                <h2 className="text-white text-[25px] font-bold text-center">
                    파일명 입력
                </h2>
                <input
                    type="text"
                    name="title"
                    value={bookTitle}
                    onChange={handleInputChange}
                    placeholder="책 제목을 입력하세요"
                    className="w-[225px] h-[30px] -translate-y-[5px] bg-transparent text-white my-[45px] text-center placeholder:text-white border-b border-white focus:outline-none"
                />
                <div className="flex w-[215px] justify-around items-center">
                    <button
                        onClick={handleConvert}
                        disabled={!bookTitle || isLoading}
                        className={`w-[100px] h-[35px] rounded-3xl font-medium
                    ${!bookTitle || isLoading
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                        변환하기
                    </button>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className={`w-[100px] h-[35px] rounded-3xl font-medium
                    ${isLoading
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="w-full text-center relative">
            <div className="mx-[14px] my-[42px] flex items-center flex-col">
                <h2 className="text-white font-bold text-[25px] mb-[30px]">파일 변환 중...</h2>
                <div className="w-full flex justify-center h-28">
                    <div className="inline-block h-[100px] w-[100px] animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] self-center">
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                    </span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="w-full text-center mt-[42.5px]">
            <h2 className="text-white text-[25px] font-bold mb-2">변환 완료!</h2>
            <h2 className="my-[15px] text-[50px]">🎉</h2>
            <div className="flex justify-center space-x-4">
                <button
                    onClick={() => {
                        onComplete();
                        navigate("/library/book");
                    }}
                    className="flex justify-center items-center w-[100px] h-[35px] bg-blue-600 text-white rounded-3xl font-[15px] hover:bg-blue-700"
                >
                    보관함으로
                </button>
                <button
                    onClick={() => onComplete()}
                    className="flex justify-center items-center w-[100px] h-[35px] bg-blue-600 text-white rounded-3xl font-[15px] hover:bg-blue-700"
                >
                    닫기
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-[#1F222A] w-[312px] h-[266px] rounded-3xl relative">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
            </div>
        </div>
    );
};

export default BookConvertModal;