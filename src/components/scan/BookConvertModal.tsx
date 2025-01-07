import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

interface PhotoFile {
    id: string;
    data: string;
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
    const [author, setAuthor] = useState<string>("");
    const [publisher, setPublisher] = useState<string>("");
    const [progress, setProgress] = useState<number>(0);

    // 모달 초기화 함수
    const resetModal = () => {
        setStep(1);
        setBookTitle("");
        setAuthor("");
        setPublisher("");
        setProgress(0);
    };

    // 모달이 닫힐 때 초기화
    const handleClose = () => {
        onClose();
        // 애니메이션이 끝난 후 초기화
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
        const {name, value} = e.target;
        switch (name) {
            case 'title':
                setBookTitle(value);
                break;
            case 'author':
                setAuthor(value);
                break;
            case 'publisher':
                setPublisher(value);
                break;
        }
    };

    const handleConvert = async () => {
        if (!bookTitle) return;
        setStep(2);

        try {
            // 업로드 처리
            const uploadResult = await onUpload(photos, bookTitle);

            if (uploadResult) {
                setStep(3);
                onComplete();
            } else {
                // 업로드 실패 시 처리
                setStep(1);
                // 에러 메시지 표시 로직 추가
            }
        } catch (error) {
            setStep(1);
            // 에러 처리 로직 추가
        }
    };

    const renderStep1 = () => (
        <div className="w-full">
            <h2 className="text-white text-xl font-bold mb-4 text-center">
                파일명 입력
            </h2>
            <input
                type="text"
                name="title"
                value={bookTitle}
                onChange={handleInputChange}
                placeholder="책 제목"
                className="w-full bg-gray-700 text-white p-3 rounded-lg mb-4"
            />
            <div className="flex py-3 w-full justify-around items-center">
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
                    disabled={!bookTitle || isLoading}
                    className={`w-[100px] h-[35px] rounded-3xl font-medium
                    ${isLoading
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                    닫기
                </button>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="w-full text-center relative">
            <h2 className="text-white text-xl font-bold text-[25px] mb-[30px]">파일 변환 중...</h2>
            <div className="w-full flex justify-center h-28">
                <div className="inline-block h-[100px] w-[100px] animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] self-center">
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                    </span>
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
                    onClick={() => navigate("/library/book")}
                    className="flex justify-center items-center w-[100px] h-[35px] bg-blue-600 text-white rounded-3xl font-[15px] hover:bg-blue-700"
                >
                    보관함으로
                </button>
                <button
                    onClick={handleClose}
                    className="flex justify-center items-center w-[100px] h-[35px] bg-blue-600 text-white rounded-3xl font-[15px] hover:bg-blue-700"
                >
                    닫기
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-[#1F222A] w-[312px] h-[266px] rounded-2xl relative">
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
            </div>
        </div>
    );
};

export default BookConvertModal;