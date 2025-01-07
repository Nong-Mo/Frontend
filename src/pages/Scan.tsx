import React, {useRef, useState} from "react";
import {Camera} from "react-camera-pro";
import {useNavigate} from "react-router-dom";
import {NavBar} from "../components/common/NavBar.tsx";
import {CameraControls} from "../components/scan/CameraControls.tsx";
import {useCamera} from "../hooks/useCamera";
import {useCameraState} from "../hooks/useCameraState";
import {usePhotoUpload} from "../hooks/usePhotoUpload";
import {ScanViewer} from "../components/scan/ScanViewer.tsx";
import BookConvertModal from "../components/scan/BookConvertModal";
import ReceiptConvertModal from "../components/scan/ReceiptConvertModal";
import GoodsConvertModal from "../components/scan/GoodsConvertModal";

export type ScanType = 'BOOK' | 'RECEIPT' | 'GOODS';

interface PhotoFile {
    id: string;
    data: string;
}

const Scan = () => {
    const navigate = useNavigate();
    const cameraRef = useRef<Camera>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [scanType, setScanType] = useState<ScanType>('BOOK');

    // Custom Hooks
    const {
        isLoading,
        uploadStatus,
        handleUpload,
        resetUploadState
    } = usePhotoUpload();

    const {
        isPreviewVisible,
        cameraError,
        resetCamera,
        handleCameraError,
        setCameraError,
    } = useCameraState(cameraRef);

    const {
        hasCameraPermission,
        takePhoto,
        capturedPhotos,
        clearPhotos,
        removePhoto,
    } = useCamera(cameraRef);

    // Event Handlers
    const handleTakePhoto = async () => {
        if (!hasCameraPermission || isLoading) return;

        try {
            setCameraError(null);
            const photo = await takePhoto();
            if (!photo?.data) {
                throw new Error("사진 데이터를 가져올 수 없습니다.");
            }
        } catch (error) {
            handleCameraError(error as Error);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetUploadState();
    };

    const handlePhotoUpload = async () => {
        setIsModalOpen(true);
    };

    const handleUploadComplete = () => {
        setIsModalOpen(false);
        clearPhotos();
        // 업로드 완료 후 필요한 처리 (예: 성공 메시지 표시, 페이지 이동 등)
    };

    // 모달 렌더링 로직
    const renderModal = () => {
        if (!isModalOpen) return null;

        const modalProps = {
            photos: capturedPhotos,
            onClose: handleCloseModal,
            onUpload: handleUpload,
            onComplete: handleUploadComplete,
            isLoading: isLoading,
        };

        switch (scanType) {
            case 'BOOK':
                return <BookConvertModal {...modalProps} />;
            // case 'RECEIPT':
            //     return <ReceiptConvertModal {...modalProps} />;
            // case 'GOODS':
            //     return <GoodsConvertModal {...modalProps} />;
            default:
                return null;
        }
    };

    // Error View
    if (cameraError) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
                <h2 className="text-xl mb-4">카메라 오류</h2>
                <p className="text-center mb-6">{cameraError}</p>
                <button
                    onClick={() => navigate("/")}
                    className="px-6 py-2 bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                    메인으로 돌아가기
                </button>
            </div>
        );
    }

    return (
        <div className="content-wrapper ml-[32px] mr-[32px] md-[34px] w-[350px] flex flex-col items-center h-[896px]">
            <div className="w-full">
                <NavBar
                    title="스캔하기"
                    hideLeftIcon={false}
                    showMenu={false}
                    iconNames={{
                        backIcon: "뒤로가기"
                    }}
                    rightIcons={[]}
                />
            </div>

            {/* 카메라 뷰어 */}
            <ScanViewer
                cameraRef={cameraRef}
                errorMessages={{
                    noCameraAccessible: "카메라에 접근할 수 없습니다.",
                    permissionDenied: "카메라 권한이 거부되었습니다.",
                    switchCamera: "카메라를 전환할 수 없습니다.",
                    canvas: "캔버스를 사용할 수 없습니다.",
                }}
                photos={capturedPhotos}
                onRemove={removePhoto}
                isPreviewVisible={isPreviewVisible}
            />

            {/* 카메라 컨트롤 */}
            <CameraControls
                onTakePhoto={handleTakePhoto}
                onUpload={handlePhotoUpload}
                isLoading={isLoading}
                hasCameraPermission={hasCameraPermission}
                hasPhotos={capturedPhotos.length > 0}
                scanType={scanType}
            />

            {/* 변환 모달 */}
            {renderModal()}
        </div>
    );
};

export default Scan;