const useSpeechSynthesis = () => {
    const speakText = (text: string) => {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "ko-KR";
        window.speechSynthesis.speak(speech);
    };

    return { speakText };
};

export default useSpeechSynthesis;
