import {Camera} from "react-camera-pro";
import {PhotoPreview, PhotoFile} from "./PhotoPreview.tsx";
import { useState, useEffect } from 'react';

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
}

export const ScanViewer = ({
    cameraRef,
    errorMessages,
    photos,
    onRemove,
    isPreviewVisible
}: ScanViewerProps) => {
    const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

    useEffect(() => {
        const initCamera = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                
                // 후면 카메라 확인
                const hasRearCamera = videoDevices.some(
                    device => device.label.toLowerCase().includes('back') || 
                             device.label.toLowerCase().includes('rear') ||
                             device.label.toLowerCase().includes('environment')
                );
                
                if (!hasRearCamera) {
                    console.log('후면 카메라를 찾을 수 없어 전면 카메라로 전환합니다.');
                    setFacingMode('user');
                }
            } catch (error) {
                console.error('카메라 초기화 중 오류 발생:', error);
                setFacingMode('user'); // 에러 발생 시 전면 카메라로 폴백
            }
        };

        initCamera();
    }, []);

    return (
        <div className="relative w-[414px] h-[615px]">
            <div style={{
                position: "absolute",
                width: "100%",
                height: "100%",
            }}>
                <Camera
                    ref={cameraRef}
                    facingMode={facingMode}
                    aspectRatio="cover"
                    imageType="jpeg"
                    errorMessages={errorMessages}
                    style={{
                        minWidth: "100%",
                        minHeight: "100%",
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                />
            </div>

            <PhotoPreview
                photos={photos}
                onRemove={onRemove}
                isVisible={isPreviewVisible}
            />
        </div>
    );
};