import {useState} from "react";
import {Camera} from "react-camera-pro";

export const useCameraState = (cameraRef: React.RefObject<Camera>) => {
    const [isPreviewVisible, setIsPreviewVisible] = useState(true);
    const [cameraError, setCameraError] = useState<string | null>(null);

    const resetCamera = () => {
        setIsPreviewVisible(false);
        setCameraError(null);
        setTimeout(() => setIsPreviewVisible(true), 200);
    };

    const handleCameraError = (error: Error) => {
        setCameraError(error.message);
        if (error.message.includes("권한") || error.message.includes("접근")) {
            alert("카메라 접근에 실패했습니다. 메인 페이지로 이동합니다.");
            resetCamera();
            return true;
        }
        alert("카메라 촬영에 실패했습니다. 다시 시도해주세요.");
        resetCamera();
        return false;
    };

    return {
        isPreviewVisible,
        cameraError,
        resetCamera,
        handleCameraError,
        setCameraError
    };
};
