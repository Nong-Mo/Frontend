import {useState, useEffect, useRef, useCallback} from 'react';

export const useAudioPlayer = (audioUrl: string) => {
    const [isPlaying, setIsPlaying] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(new Audio());

    useEffect(() => {
        return () => {
            const audio = audioRef.current;
            if (audio) {
                audio.pause();
                audio.src = '';
                setIsPlaying(0);
                setCurrentTime(0);
            }
        };
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        audio.src = audioUrl;

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleEnded = () => {
            audioRef.current.pause();  // 재생 중지
            setIsPlaying(2);  // 리플레이 아이콘 표시 상태로 변경
        };

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.pause();
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [audioUrl]);

    const togglePlay = useCallback(async () => {
        try {
            switch (isPlaying){
                case 0:
                    await audioRef.current.play();
                    setIsPlaying(1);
                    break;
                case 1:
                    audioRef.current.pause();
                    setIsPlaying(0);
                    break;
                case 2:
                    audioRef.current.currentTime = 0;
                    await audioRef.current.play();
                    setIsPlaying(1);
                    break;
            }
        } catch (error) {
            console.error('Error playing audio:', error);
            setIsPlaying(0);
        }
    }, [isPlaying]);

    const seek = useCallback((time: number) => {
        const clampedTime = Math.max(0, Math.min(time, duration));
        audioRef.current.currentTime = clampedTime;
        console.log(clampedTime + " : " + duration);
        if(clampedTime >= duration) {
            setIsPlaying(2);
        }
        setCurrentTime(clampedTime);
    }, [duration]);

    return {
        isPlaying,
        currentTime,
        duration,
        togglePlay,
        seek,
        audioRef,
    };
};