import { useState, useRef, useEffect } from 'react';

const useVoiceRecognition = (onResult: (text: string) => void) => {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new (window as any).webkitSpeechRecognition();
            recognitionRef.current = recognition;
            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.onresult = (event: any) => {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        onResult(event.results[i][0].transcript);
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                console.log("Interim Transcript:", interimTranscript);
            };

            recognition.onend = () => {
                setIsListening(false);
                console.log("Speech recognition ended");
            };

            recognition.onerror = (event: any) => {
                console.error("Speech recognition error", event);
                if (event.error === "not-allowed") {
                    alert("마이크 권한이 필요합니다. 브라우저 설정에서 마이크 권한을 허용해주세요.");
                } else if (event.error === "no-speech") {
                    alert("음성을 감지하지 못했습니다. 다시 시도해주세요.");
                } else {
                    alert(`음성 인식 중 오류가 발생했습니다: ${event.error}`);
                }
                setIsListening(false);
            };
        } else {
            alert("현재 브라우저는 음성 인식을 지원하지 않습니다. 최신 Chrome 또는 Edge 브라우저를 사용해주세요.");
        }
    }, [onResult]);

    const startRecognition = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            const recognition = recognitionRef.current;
            if (recognition && !isListening) {
                recognition.start();
                setIsListening(true);
                console.log("Voice recognition started");
            }
        } catch (error) {
            console.error("Microphone access denied or not found:", error);
            alert("마이크 장치를 찾을 수 없거나 접근이 거부되었습니다. 브라우저 설정을 확인해주세요.");
        }
    };

    const stopRecognition = () => {
        const recognition = recognitionRef.current;
        if (recognition && isListening) {
            recognition.stop();
            setIsListening(false);
        }
    };

    return { isListening, startRecognition, stopRecognition };
};

export default useVoiceRecognition;