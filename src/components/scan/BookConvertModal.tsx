import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PhotoFile } from "../../types/scan";
import confetti from "canvas-confetti";
import { useScanStore } from "../../hooks/useScanStore";

interface BookConvertModalProps {
    photos: PhotoFile[];
    api_type: string;
    onClose: () => void;
    onUpload: (photos: PhotoFile[], title: string, type: string) => Promise<boolean>;
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
    const [bookTitle, setBookTitle] = useState<string>(""); // 사용자 입력용
    const [predefinedTitle, setPredefinedTitle] = useState<string>(""); // Demo 모드에서 사용
    const [progress, setProgress] = useState<number>(0);
    const { isVerticesUpdated, resetVerticesFlag } = useScanStore();

    // Demo 모드에서 컴포넌트 렌더링 시 미리 정의된 제목으로 서버에 POST 요청
    useEffect(() => {
        if (process.env.REACT_APP_DEMO_MODE === "true" && isVerticesUpdated) {
            const demoTitleConfig = getDemoTitle(api_type);
            setPredefinedTitle(demoTitleConfig.title);

            // Demo 모드에서 POST 요청
            onUpload(photos, demoTitleConfig.title, api_type).then((result) => {
                if (!result) {
                    console.error("Demo mode initial upload failed");
                }
            });

            resetVerticesFlag(); // 상태 초기화
        }
    }, [isVerticesUpdated, api_type, photos, onUpload, resetVerticesFlag]);

    const resetModal = () => {
        setStep(1);
        setBookTitle("");
        setPredefinedTitle("");
        setProgress(0);
        localStorage.removeItem("lastUploadedTitle");
        localStorage.removeItem("lastStorageName");
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
        if (!bookTitle && !predefinedTitle) return;
        setStep(2);

        try {
            if (process.env.REACT_APP_DEMO_MODE === "true") {
                // Demo 모드에서는 이미 POST 요청이 실행되었으므로 UI 플로우만 처리
                await new Promise((resolve) => setTimeout(resolve, 1500));
                setStep(3);
            } else {
                console.log("TEST");
                // 실제 모드에서 POST 요청
                const uploadResult = await onUpload(photos, bookTitle, api_type);
                if (uploadResult) {
                    setStep(3);
                } else {
                    setStep(1);
                }
            }
        } catch (error) {
            console.error("Convert error:", error);
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
                    value={
                        bookTitle
                    }
                    onChange={handleInputChange}
                    placeholder="책 제목을 입력하세요"
                    className="w-[225px] h-[30px] -translate-y-[5px] bg-transparent text-white my-[45px] text-center placeholder:text-white border-b border-white focus:outline-none"
                />
                <div className="flex w-[215px] justify-around items-center">
                    <button
                        onClick={handleConvert}
                        disabled={(!bookTitle && !predefinedTitle) || isLoading}
                        className={`w-[100px] h-[35px] rounded-3xl font-medium
                    ${(!bookTitle && !predefinedTitle) || isLoading
                            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"}`}
                    >
                        변환하기
                    </button>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className={`w-[100px] h-[35px] rounded-3xl font-medium
                    ${isLoading
                            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"}`}
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
                    <div className="w-[100px] h-[100px] text-center">
                        <img
                            src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Smileys/Zany%20Face.webp"
                            alt="Zany Face"
                            width="100"
                            height="100"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="w-full h-full text-center flex flex-col justify-center items-center">
            {makeConfetti()}
            <h2 className="text-white text-[25px] font-bold mb-2">변환 완료!</h2>
            <img
                src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/Activity/Party%20Popper.webp"
                alt="Party Popper"
                width="100"
                height="100"
            />
            <div className="flex justify-center space-x-4">
                <button
                    onClick={() => {
                        clearPhotos();
                        navigate(`/library/${api_type}`);
                        confetti.reset();
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

    const makeConfetti = useCallback(() => {
        confetti({
            angle: 55,
            spread: 150,
            particleCount: 100,
            origin: { y: 0.5 },
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
