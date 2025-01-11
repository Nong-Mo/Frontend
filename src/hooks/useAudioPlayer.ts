import {useState, useEffect, useRef, useCallback} from 'react';

export const useAudioPlayer = (audioUrl: string) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(new Audio());

    // audioUrl이 변경될 때마다 useEffect가 실행됨
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
            setIsPlaying(false);
            setCurrentTime(0)
        }

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [audioUrl]);

    const togglePlay = useCallback(async () => {
        try {
            if (isPlaying) {
                await audioRef.current.pause();
            } else {
                await audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        } catch (error) {
            console.error('Audio playback error:', error);
            // 에러 발생 시 재생 상태를 false로 설정
            setIsPlaying(false);
        }
    }, [isPlaying]);

    const seek = useCallback((time: number) => {
        const clampedTime = Math.max(0, Math.min(time, duration));
        audioRef.current.currentTime = clampedTime;
        setCurrentTime(clampedTime);
    }, [duration]);

    return {
        isPlaying,
        currentTime,
        duration,
        volume,
        togglePlay,
        seek,
        isMuted,
        audioRef,
    };
};