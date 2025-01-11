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
            setCurrentTime(0);
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

    const togglePlay = useCallback(() => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    }, [isPlaying]); // isPlaying을 의존성 배열에 포함

    const seek = useCallback((time: number) => {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    }, []);

    const setAudioVolume = useCallback((newVolume: number) => {
        setVolume(newVolume);
    }, []);

    const toggleMute = useCallback(() => {
        setIsMuted(prevIsMuted => !prevIsMuted);
    }, []);


    return {
        isPlaying,
        currentTime,
        duration,
        volume,
        togglePlay,
        seek,
        setAudioVolume,
        isMuted,
        toggleMute,
        audioRef,
    };
};