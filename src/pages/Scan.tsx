import React, { useRef, useState, useEffect } from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import { NavBar } from "../components/common/NavBar.tsx";
import { CameraControls } from "../components/scan/CameraControls.tsx";
import { ScanViewer } from "../components/scan/ScanViewer.tsx";
import BookConvertModal from "../components/scan/BookConvertModal";
import { useScanStore } from "../hooks/useScanStore";
import { usePhotoUpload } from "../hooks/usePhotoUpload";
import { APITypeKeys } from "./LibraryViewer.tsx";
import ReceiptConvertModal from "../components/scan/ReceiptConvertModal.tsx";

const CAPTURE_IMAGE_MIME_TYPES = 'image/png,image/jpeg,image/webp';

export type ScanType = 'BOOK' | 'RECEIPT' | 'GOODS';

const SCAN_CONFIG: Record<APITypeKeys, { title: string; viewerType: APITypeKeys }> = {
    idea: {
        title: '스캔',
        viewerType: 'idea'
    },
    novel: {
        title: '스캔',
        viewerType: 'novel'
    }
};

const Scan = () => {
    const { id } = useParams<{ id: APITypeKeys }>();
    const scanType = id;
    const isInitialMount = useRef(true);
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const { photos, addPhoto, clearPhotos: clearStorePhotos } = useScanStore();

    const location = useLocation();

    const {
        isLoading,
        uploadStatus,
        handleUpload,
        resetUploadState
    } = usePhotoUpload();

    // 현재 스캔 타입에 따른 설정
    const currentConfig = SCAN_CONFIG[scanType];

    useEffect( () => {
        if(location.state?.fromVertex == null)
            clearStorePhotos();
    }, [location.state?.fromVertex]);

    const handleImageCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
    
            reader.onloadend = () => {
                const photoId = Date.now().toString();
                const photoData = reader.result as string;
                const img = new Image();
                img.onload = () => {
                    addPhoto({
                        id: photoId,
                        data: photoData,
                        originalSize: { width: img.width, height: img.height }
                    });
                    navigate(`/scan/${currentConfig.viewerType}/vertex`, {
                        state: {
                            photoId: photoId,
                            photoData: photoData
                        }
                    });
                };
                img.src = photoData;
            };
    
            reader.readAsDataURL(file);
        }
    };

    const handleTakePhoto = () => {
        if (isLoading) return;
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleGalleryTakePhoto = () => {
        if(isLoading) return;
        if(galleryInputRef.current) {
            galleryInputRef.current.click();
        }
    }

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
            api_type: currentConfig.viewerType,
            photos: photos,
            onClose: handleCloseModal,
            onUpload: handleUpload, 
            onComplete: handleUploadComplete,
            isLoading: isLoading,
            clearPhotos: clearStorePhotos
        };

        return <BookConvertModal {...modalProps} />;
    };

    if (cameraError) {
        return (
            <div className="mt-[15px] w-full h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
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
        <div className="w-full flex flex-col min-h-screen z-10 mt-[15px]">
            <NavBar
                title={currentConfig.title}
                hideLeftIcon={false}
                showMenu={false}
                iconNames={{
                    backIcon: "뒤로가기"  
                }}
                backPageName= { `/library/${scanType}` }
                rightIcons={[]}
            />
            <div className="w-full flex flex-col items-center">
                <ScanViewer
                    photos={photos.map(photo => ({
                        ...photo,
                        originalSize: photo.originalSize || {width: 0, height: 0}
                    }))}
                    onRemove={(id) => useScanStore.getState().removePhoto(id)}
                    type={currentConfig.viewerType}
                />

                <CameraControls
                    onTakePhoto={handleTakePhoto}
                    onUpload={handlePhotoUpload}
                    onGalleryPhoto={handleGalleryTakePhoto}
                    isLoading={isLoading}
                    hasCameraPermission={true}
                    hasPhotos={photos.length > 0}
                    scanType={scanType as ScanType}
                />

                <input
                    type="file"
                    accept={CAPTURE_IMAGE_MIME_TYPES}
                    onChange={handleImageCapture}
                    className="hidden"
                    ref={fileInputRef}
                    capture="environment"
                />
                <input
                    type="file"
                    accept={`${CAPTURE_IMAGE_MIME_TYPES};capture=gallery`}
                    onChange={handleImageCapture}
                    className="hidden"
                    ref={galleryInputRef}
                />

            </div>
            {renderModal()}
        </div>
    );
};

export default Scan;