import { useState, useRef, useEffect } from 'react';

// useVoiceRecognition 훅 정의
// 매개변수: onResult (음성 인식 결과를 처리하는 콜백 함수)
// 반환값: isListening (음성 인식 중인지 여부), startRecognition (음성 인식 시작 함수), stopRecognition (음성 인식 중지 함수)
const useVoiceRecognition = (onResult: (text: string) => void) => {
    // 음성 인식 중인지 여부를 저장하는 상태
    const [isListening, setIsListening] = useState(false);
    // SpeechRecognition 객체를 저장하는 ref
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    // 컴포넌트가 마운트될 때 실행되는 useEffect 훅
    useEffect(() => {
        // 브라우저가 webkitSpeechRecognition을 지원하는지 확인
        if ('webkitSpeechRecognition' in window) {
            // webkitSpeechRecognition 객체 생성
            const recognition = new (window as any).webkitSpeechRecognition();
            recognitionRef.current = recognition;
            recognition.continuous = true; // 연속 인식 설정
            recognition.interimResults = true; // 중간 결과 설정

            // 음성 인식 결과 이벤트 핸들러
            recognition.onresult = (event: any) => {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        // 최종 결과일 경우 onResult 콜백 호출
                        onResult(event.results[i][0].transcript);
                    } else {
                        // 중간 결과일 경우 interimTranscript에 추가
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                console.log("Interim Transcript:", interimTranscript);
            };

            // 음성 인식 종료 이벤트 핸들러
            recognition.onend = () => {
                setIsListening(false);
                console.log("Speech recognition ended");
            };

            // 음성 인식 오류 이벤트 핸들러
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

    // 음성 인식 시작 함수
    // 매개변수: 없음
    // 반환값: 없음
    const startRecognition = async () => {
        try {
            // 마이크 권한 요청
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

    // 음성 인식 중지 함수
    // 매개변수: 없음
    // 반환값: 없음
    const stopRecognition = () => {
        const recognition = recognitionRef.current;
        if (recognition && isListening) {
            recognition.stop();
            setIsListening(false);
        }
    };

    // 훅에서 반환하는 값들
    return { isListening, startRecognition, stopRecognition };
};

export default useVoiceRecognition;