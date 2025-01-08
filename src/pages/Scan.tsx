import React, { useRef, useState } from "react";
import { Camera } from "react-camera-pro";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../components/common/NavBar.tsx";
import { CameraControls } from "../components/scan/CameraControls.tsx";
import { useCamera } from "../hooks/useCamera";
import { useCameraState } from "../hooks/useCameraState";
import { usePhotoUpload } from "../hooks/usePhotoUpload";
import { ScanViewer } from "../components/scan/ScanViewer.tsx";
import BookConvertModal from "../components/scan/BookConvertModal";
import { useScanStore } from "../hooks/useScanStore";

export type ScanType = 'BOOK' | 'RECEIPT' | 'GOODS';

const Scan = () => {
    const navigate = useNavigate();
    const cameraRef = useRef<Camera>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [scanType, setScanType] = useState<ScanType>('BOOK');
    const { photos, addPhoto, clearPhotos: clearStorePhotos } = useScanStore();

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
    } = useCamera(cameraRef);

    const handleTakePhoto = async () => {
        if (!hasCameraPermission || isLoading) return;
        
        try {
            const photo = await takePhoto();
            if (!photo?.data) {
                throw new Error("사진 데이터를 가져올 수 없습니다.");
            }
            
            addPhoto(photo);
            
            navigate('/scan/vertex', {
                state: {
                    photoId: photo.id,
                    photoData: photo.data
                }
            });
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
        clearStorePhotos();
    };

    const renderModal = () => {
        if (!isModalOpen) return null;

        const modalProps = {
            photos: photos,
            onClose: handleCloseModal,
            onUpload: handleUpload,
            onComplete: handleUploadComplete,
            isLoading: isLoading,
            clearPhotos: clearStorePhotos
        };

        switch (scanType) {
            case 'BOOK':
                return <BookConvertModal {...modalProps} />;
            default:
                return null;
        }
    };

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
        <div className="z-50 content-wrapper ml-[32px] mr-[32px] md-[34px] w-[414px] flex flex-col items-center h-[896px]">
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

            <ScanViewer
                cameraRef={cameraRef}
                errorMessages={{
                    noCameraAccessible: "카메라에 접근할 수 없습니다.",
                    permissionDenied: "카메라 권한이 거부되었습니다.",
                    switchCamera: "카메라를 전환할 수 없습니다.",
                    canvas: "캔버스를 사용할 수 없습니다.",
                }}
                photos={photos}
                onRemove={(id) => useScanStore.getState().removePhoto(id)}
                isPreviewVisible={isPreviewVisible}
            />

            <CameraControls
                onTakePhoto={handleTakePhoto}
                onUpload={handlePhotoUpload}
                isLoading={isLoading}
                hasCameraPermission={hasCameraPermission}
                hasPhotos={photos.length > 0}
                scanType={scanType}
            />

            {renderModal()}
        </div>
    );
};

export default Scan;