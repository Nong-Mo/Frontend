import React, { useState, useEffect } from 'react';
import { Camera } from 'react-camera-pro';
import { useNavigate } from 'react-router-dom';
import { PhotoPreview, PhotoFile } from "./PhotoPreview";

interface ScanViewerProps {
    cameraRef: React.RefObject<Camera>;
    errorMessages: {
        noCameraAccessible: string;
        permissionDenied: string;
        switchCamera: string;
        canvas: string;
    };
    photos: PhotoFile[];
    onRemove: (id: string) => void;
    isPreviewVisible: boolean;
    setIsPreviewVisible: (value: boolean) => void;
}

// OCR에 최적화된 해상도 설정
const OCR_RESOLUTION = {
    width: { ideal: 2560, min: 1920 },
    height: { ideal: 1440, min: 1080 }
};

// OCR에 최적화된 카메라 설정
const OCR_OPTIMIZED_SETTINGS = {
    // 자동 초점 최적화
    focusMode: 'continuous',
    focusDistance: { ideal: 30 },
    
    // 빠른 초점 잡기를 위한 설정
    autoFocusSpeed: 'fast',
    autoFocusAssist: true,
    
    // 손떨림 방지 및 안정화 강화
    imageStabilization: true,
    
    // 노출 설정 최적화
    exposureMode: 'continuous',
    exposureTime: { min: 1000, max: 3000 },
    exposureCompensation: { ideal: 0.3 },
    
    // 선명도 최적화
    whiteBalanceMode: 'continuous',
    contrast: { ideal: 1.4 },
    sharpness: { ideal: 2.0 },
    
    // 노이즈 감소
    noiseReduction: 'high'
};

export const ScanViewer = ({
    cameraRef,
    errorMessages,
    photos,
    onRemove, 
    isPreviewVisible,
    setIsPreviewVisible,
    mode = 'document'
}: ScanViewerProps) => {
    const navigate = useNavigate();
    const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [currentTrack, setCurrentTrack] = useState<MediaStreamTrack | null>(null);

    useEffect(() => {
        const initCamera = async () => {
            try {
                const constraints = {
                    video: {
                        facingMode: 'environment',
                        ...OCR_RESOLUTION,
                        advanced: [OCR_OPTIMIZED_SETTINGS]
                    }
                };

                const newStream = await navigator.mediaDevices.getUserMedia(constraints);
                const track = newStream.getVideoTracks()[0];

                setStream(newStream);
                setCurrentTrack(track);

                return () => {
                    track.stop();
                    newStream.getTracks().forEach(track => track.stop());
                };
            } catch (error) {
                console.error('Camera initialization error:', error);
                setFacingMode('user');
            }
        };

        initCamera();
    }, []);

    return (
        <div className="relative w-[414px] h-[615px]">
            <div className="absolute inset-0">
                <Camera
                    ref={cameraRef}
                    facingMode={facingMode}
                    aspectRatio="cover"
                    imageType="jpeg"
                    imageCompression={1.0}
                    errorMessages={errorMessages}
                    className="min-w-full min-h-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                />
            </div>
            
            <PhotoPreview
                photos={photos}
                onRemove={onRemove}
                isVisible={isPreviewVisible}
                setIsVisible={setIsPreviewVisible}
            />
        </div>
    );
};

export default ScanViewer;