import { useState, useRef } from 'react';

const useVoiceRecognition = (onResult: (text: string) => void) => {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null); // recognition 객체를 Ref로 관리

    const startRecognition = () => {
        if (!("webkitSpeechRecognition" in window)) {
            alert("음성 인식을 지원하지 않는 브라우저입니다.");
            return;
        }

        const recognition = new (window as any).webkitSpeechRecognition();
        recognitionRef.current = recognition; // Ref에 저장
        recognition.lang = "ko-KR";
        recognition.start();
        setIsListening(true);

        recognition.onresult = (event: any) => {
            const voiceText = event.results[0][0].transcript;
            onResult(voiceText); // 결과 콜백 호출
        };

        recognition.onerror = () => {
            alert("음성 인식 중 오류가 발생했습니다.");
            stopRecognition();
        };

        recognition.onend = () => {
            setIsListening(false); // 음성 인식 종료
        };
    };

    const stopRecognition = () => {
        const recognition = recognitionRef.current;
        if (recognition) {
            recognition.stop();
            setIsListening(false);
            recognitionRef.current = null; // 객체 초기화
        } else {
            console.warn("음성 인식 객체가 초기화되지 않았습니다.");
        }
    };

    return { startRecognition, stopRecognition, isListening };
};

export default useVoiceRecognition;
