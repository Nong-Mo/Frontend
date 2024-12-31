import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface BookConvertModalProps {
  isOpen: boolean;
  onClose: () => void;
  uploadStatus: {
    success: boolean;
    message: string;
  } | null;
}

const BookConvertModal: React.FC<BookConvertModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate;
  const [step, setStep] = useState<number>(1);
  const [bookTitle, setBookTitle] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);

  // 모달 초기화 함수
  const resetModal = () => {
    setStep(1);
    setBookTitle("");
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

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookTitle(e.target.value);
  };

  const handleConvert = () => {
    if (!bookTitle) return;
    setStep(2);
    // 변환 시뮬레이션
    setTimeout(() => {
      setStep(3);
    }, 3000);
  };

  const renderStep1 = () => (
    <div className="w-full">
      <h2 className="text-white text-xl font-bold mb-4">
        책 제목을 입력해 주세요.
      </h2>
      <input
        type="text"
        value={bookTitle}
        onChange={handleInputChange}
        placeholder="책 제목"
        className="w-full bg-gray-700 text-white p-3 rounded-lg mb-4"
      />
      <button
        onClick={handleConvert}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium"
      >
        변환하기
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="w-full text-center relative">
      <h2 className="text-white text-xl font-bold mb-4">파일 변환 중...</h2>
      <p className="text-gray-300 mb-6">책이 만들어지고 있어요!</p>
      <div className="w-full flex justify-center h-28">
        <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] self-center">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="w-full text-center">
      <h2 className="text-white text-xl font-bold mb-2">변환 완료 🎉</h2>
      <p className="text-gray-300 mb-6">책이 만들어졌어요! 확인하러 갈까요?</p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => window.location.href = "/library"}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium"
        >
          보관함으로
        </button>
        <button
          onClick={handleClose}
          className="px-6 py-3 bg-gray-700 text-white rounded-lg font-medium"
        >
          더 스캔하기
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-[#1F222A] w-[320px] rounded-2xl p-6 relative">
        {step === 1 && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white"
          >
            ✕
          </button>
        )}

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default BookConvertModal;
