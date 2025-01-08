import { useState, useRef, useEffect } from 'react';

/**
 * 음성 인식 기능을 제공하는 커스텀 훅
 *
 * @param onResult - 음성 인식 결과를 처리하는 콜백 함수
 * @returns {Object} - 음성 인식 관련 상태와 제어 함수들을 포함한 객체
 *   - isListening: 현재 음성 인식 중인지 여부
 *   - startRecognition: 음성 인식을 시작하는 함수
 *   - stopRecognition: 음성 인식을 중지하는 함수
 *   - transcript: 현재까지 인식된 텍스트
 *   - startTime: 음성 인식 시작 시간
 */
const useVoiceRecognition = (onResult: (text: string) => void) => {
    // 상태 관리를 위한 state와 ref 선언
    const [isListening, setIsListening] = useState(false);          // 음성 인식 상태
    const [transcript, setTranscript] = useState('');               // 인식된 텍스트
    const recognitionRef = useRef<SpeechRecognition | null>(null); // 음성 인식 객체 참조
    const startTimeRef = useRef<number>(0);                        // 시작 시간 참조
    const finalTranscriptRef = useRef<string>('');                 // 최종 인식 결과 참조
    const interimTranscriptRef = useRef<string>('');               // 중간 인식 결과 참조

    /**
     * Web Speech API의 SpeechRecognition 객체를 생성하고 설정하는 함수
     * @returns {SpeechRecognition | null} 설정된 음성 인식 객체 또는 null
     */
    const createRecognition = () => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new (window as any).webkitSpeechRecognition();
            recognition.continuous = true;     // 연속 인식 활성화
            recognition.interimResults = true; // 중간 결과 활성화
            recognition.lang = 'ko-KR';        // 한국어 인식 설정

            // 음성 인식 시작 시 호출되는 이벤트 핸들러
            recognition.onstart = () => {
                startTimeRef.current = Date.now();
                setIsListening(true);
                finalTranscriptRef.current = '';
                interimTranscriptRef.current = '';
            };

            // 음성 인식 결과 처리 이벤트 핸들러
            recognition.onresult = (event: any) => {
                interimTranscriptRef.current = '';
                finalTranscriptRef.current = '';

                // 모든 인식 결과를 순회하며 최종/중간 결과 분리
                for (let i = 0; i < event.results.length; i++) {
                    const result = event.results[i];
                    if (result.isFinal) {
                        finalTranscriptRef.current += result[0].transcript;
                    } else {
                        interimTranscriptRef.current += result[0].transcript;
                    }
                }

                // 현재까지의 전체 인식 결과 업데이트
                const currentTranscript =
                    finalTranscriptRef.current + interimTranscriptRef.current;

                if (currentTranscript.trim()) {
                    setTranscript(currentTranscript);
                }
            };

            // 오류 처리 이벤트 핸들러
            recognition.onerror = (event: any) => {
                console.error("Speech recognition error", event);

                switch (event.error) {
                    case "not-allowed":
                        alert("마이크 권한이 필요합니다. 브라우저 설정에서 마이크 권한을 허용해주세요.");
                        break;
                    case "no-speech":
                        if (isListening && recognitionRef.current) {
                            try {
                                recognition.start();
                            } catch (error) {
                                console.error("Failed to restart after no-speech:", error);
                            }
                        }
                        break;
                    default:
                        alert(`음성 인식 중 오류가 발생했습니다: ${event.error}`);
                }
            };

            return recognition;
        }

        alert("현재 브라우저는 음성 인식을 지원하지 않습니다. 최신 Chrome 또는 Edge 브라우저를 사용해주세요.");
        return null;
    };

    /**
     * 음성 인식을 시작하는 함수
     * 마이크 권한을 확인하고 음성 인식 객체를 초기화하여 시작
     */
    const startRecognition = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });

            // 이전 인스턴스가 있다면 정리
            if (recognitionRef.current) {
                recognitionRef.current.stop();
                recognitionRef.current = null;
            }

            const recognition = createRecognition();
            if (recognition) {
                recognitionRef.current = recognition;
                setTranscript('');
                finalTranscriptRef.current = '';
                interimTranscriptRef.current = '';
                recognition.start();
            }
        } catch (error) {
            console.error("Microphone access denied or not found:", error);
            alert("마이크 장치를 찾을 수 없거나 접근이 거부되었습니다. 브라우저 설정을 확인해주세요.");
        }
    };

    /**
     * 음성 인식을 중지하는 함수
     * 현재 진행 중인 음성 인식을 중지하고 상태를 초기화
     */
    const stopRecognition = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
            setIsListening(false);
            setTranscript(finalTranscriptRef.current + interimTranscriptRef.current);
            startTimeRef.current = 0;
        }
    };

    // 컴포넌트 언마운트 시 cleanup
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
                recognitionRef.current = null;
            }
        };
    }, []);

    // 훅의 반환값
    return {
        isListening,     // 현재 음성 인식 상태
        startRecognition,// 음성 인식 시작 함수
        stopRecognition, // 음성 인식 중지 함수
        transcript,      // 현재 인식된 텍스트
        startTime: startTimeRef.current // 음성 인식 시작 시간
    };
};

export default useVoiceRecognition;