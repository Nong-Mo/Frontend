import {useState, useEffect, useRef, useCallback} from 'react';

export const useAudioPlayer = (audioUrl: string) => {
    const [isPlaying, setIsPlaying] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const audioRef = useRef<HTMLAudioElement>(new Audio());

    useEffect(() => {
        const audio = audioRef.current;
        
        // 초기화 및 설정
        audio.preload = 'metadata';
        audio.src = audioUrl;

        // 메타데이터 강제 로드
        try {
            audio.load();
        } catch (error) {
            console.error('Error loading audio:', error);
        }

        const handleLoadedMetadata = () => {
            console.log('Metadata loaded - Duration:', audio.duration);
            setDuration(audio.duration);
            setIsLoading(false);
        };

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleEnded = () => {
            audio.pause();
            setIsPlaying(2);
        };

        const handleError = (e: Event) => {
            console.error('Audio error:', {
                error: audio.error,
                readyState: audio.readyState,
                networkState: audio.networkState,
                src: audio.src
            });
            setIsLoading(false);
        };

        // 버퍼링 모니터링
        const handleProgress = () => {
            if (audio.buffered.length > 0) {
                const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
                console.log('Buffered until:', bufferedEnd, 'Total duration:', audio.duration);
            }
        };

        // 이벤트 리스너 등록
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);
        audio.addEventListener('progress', handleProgress);
        audio.addEventListener('durationchange', () => {
            console.log('Duration changed:', audio.duration);
            setDuration(audio.duration);
        });

        return () => {
            audio.pause();
            audio.src = '';
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('error', handleError);
            audio.removeEventListener('progress', handleProgress);
            setIsPlaying(0);
            setCurrentTime(0);
        };
    }, [audioUrl]);

    const togglePlay = useCallback(async () => {
        const audio = audioRef.current;
        
        if (isLoading) {
            console.log('Audio is still loading...');
            return;
        }

        try {
            switch (isPlaying) {
                case 0:
                    // 재생 전 readyState 확인
                    if (audio.readyState < 2) {
                        console.log('Audio not ready yet. Current readyState:', audio.readyState);
                        await new Promise<void>((resolve) => {
                            audio.addEventListener('canplay', () => resolve(), { once: true });
                        });
                    }
                    await audio.play();
                    setIsPlaying(1);
                    break;
                case 1:
                    audio.pause();
                    setIsPlaying(0);
                    break;
                case 2:
                    audio.currentTime = 0;
                    await audio.play();
                    setIsPlaying(1);
                    break;
            }
        } catch (error) {
            console.error('Error playing audio:', error);
            setIsPlaying(0);
        }
    }, [isPlaying, isLoading]);

    const seek = useCallback((time: number) => {
        if (isLoading) return;
        
        const audio = audioRef.current;
        const clampedTime = Math.max(0, Math.min(time, duration));
        
        try {
            audio.currentTime = clampedTime;
            console.log('Seeking to:', {
                requestedTime: time,
                clampedTime: clampedTime,
                duration: duration,
                readyState: audio.readyState
            });
            
            if (clampedTime >= duration) {
                setIsPlaying(2);
            }
            setCurrentTime(clampedTime);
        } catch (error) {
            console.error('Error seeking:', error);
        }
    }, [duration, isLoading]);

    return {
        isPlaying,
        currentTime,
        duration,
        togglePlay,
        seek,
        audioRef,
        isLoading
    };
};