import React, {useState, useEffect, useCallback} from "react";
import {useNavigate} from "react-router-dom";
import {PhotoFile} from "../../types/scan";
import confetti from "canvas-confetti";

interface BookConvertModalProps {
    photos: PhotoFile[];
    onClose: () => void;
    onUpload: (photos: PhotoFile[], title: string, type : string) => Promise<boolean>;
    onComplete: () => void;
    isLoading: boolean;
    clearPhotos: () => void;
}

const BookConvertModal: React.FC<BookConvertModalProps> = ({
    api_type,
    photos,
    onClose,
    onUpload,
    onComplete,
    isLoading,
    clearPhotos,
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
            // bookTitle을 onUpload 함수에 전달
            const uploadResult = await onUpload(photos, bookTitle, api_type);

            if (uploadResult) {
                setStep(3);
            } else {
                setStep(1);
            }
        } catch (error) {
            setStep(1);
        }
    };

    const handleGoToLibrary = useCallback(() => {
        // Safari 스크롤 이슈 해결을 위한 처리
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';
        
        clearPhotos();
        confetti.reset();
        
        // RAF를 사용하여 레이아웃 업데이트 보장
        requestAnimationFrame(() => {
            navigate(`/library/${api_type}`);
            window.location.reload();
        });
    }, [navigate, api_type, clearPhotos]);

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
        <div className="w-full h-full text-center flex flex-col justify-center items-center">
            <div className="mx-[14px] my-[42px] flex items-center flex-col">
                <h2 className="text-white font-bold text-[25px] mb-[30px]">파일 변환 중...</h2>
                <div className="w-full flex justify-center h-28">
                    <div className="w-[150px] h-[150px] text-center">
                        <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/refs/heads/main/Animals%20and%20Nature/Cloud.webp"
                             alt="Zany Face"
                             width="150"
                             height="150"
                             className="mb-2"/>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="w-full h-full text-center flex flex-col justify-center items-center">
            {makeConfetti()}
            <h2 className="text-white text-[25px] font-bold mb-3">변환 완료!</h2>
            <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Activity/Party%20Popper.webp"
                 alt="Party Popper"
                 width="100"
                 height="100"
                 className="mb-3"/>
            <div className="flex justify-center space-x-4">
                <button
                    onClick={handleGoToLibrary}
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

    const makeConfetti = useCallback(() => {
        const randomInRange = (min, max) => {
            return Math.random() * (max - min) + min;
        };

        confetti({
            angle: 55,
            spread: 150,
            particleCount: 100,
            origin: {y: 0.5}
        });
    }, []);

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