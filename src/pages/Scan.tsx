import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { NavBar } from "../components/common/NavBar.tsx";
import { CameraControls } from "../components/scan/CameraControls.tsx";
import { ScanViewer } from "../components/scan/ScanViewer.tsx";
import BookConvertModal from "../components/scan/BookConvertModal";
import { useScanStore } from "../hooks/useScanStore";
import { usePhotoUpload } from "../hooks/usePhotoUpload";

const CAPTURE_IMAGE_MIME_TYPES = 'image/png,image/jpeg,image/webp';

export type ScanType = 'BOOK' | 'RECEIPT' | 'GOODS';

// 스캔 타입별 설정 매핑
const SCAN_CONFIG = {
    BOOK: {
        viewerType: 'document' as const,
        title: '도서 스캔',
    },
    RECEIPT: {
        viewerType: 'receipt' as const,
        title: '영수증 스캔',
    },
    GOODS: {
        viewerType: 'document' as const,
        title: '물품 스캔',
    }
};

const Scan = () => {
    const isInitialMount = useRef(true);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [scanType, setScanType] = useState<ScanType>('BOOK');
    const [cameraError, setCameraError] = useState<string | null>(null);
    const { photos, addPhoto, clearPhotos: clearStorePhotos } = useScanStore();

    const {
        isLoading,
        uploadStatus,
        handleUpload,
        resetUploadState
    } = usePhotoUpload();

    // URL 쿼리 파라미터에서 type 가져오기
    useEffect(() => {
        const typeParam = searchParams.get('type') as ScanType;
        if (typeParam && Object.keys(SCAN_CONFIG).includes(typeParam)) {
            setScanType(typeParam);
        }
    }, [searchParams]);

    // 현재 스캔 타입에 따른 설정
    const currentConfig = SCAN_CONFIG[scanType];

    useEffect(() => {
        if (isInitialMount.current && !photos.length) {
            isInitialMount.current = false;
            setTimeout(() => {
                handleTakePhoto();
            }, 100);
        }
    }, []);

    const handleImageCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            
            reader.onloadend = () => {
                const photoId = Date.now().toString();
                const photoData = reader.result as string;
                
                addPhoto({ id: photoId, data: photoData });
                
                navigate('/scan/vertex', {
                    state: {
                        photoId: photoId,
                        photoData: photoData
                    }
                });
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
                    title={currentConfig.title}
                    hideLeftIcon={false}
                    showMenu={false}
                    iconNames={{
                        backIcon: "뒤로가기"
                    }}
                    rightIcons={[]}
                />
            </div>

            <ScanViewer
                photos={photos}
                onRemove={(id) => useScanStore.getState().removePhoto(id)}
                type={currentConfig.viewerType}
            />

            <CameraControls
                onTakePhoto={handleTakePhoto}
                onUpload={handlePhotoUpload}
                isLoading={isLoading}
                hasCameraPermission={true}
                hasPhotos={photos.length > 0}
                scanType={scanType}
            />

            <input
                type="file"
                accept={CAPTURE_IMAGE_MIME_TYPES}
                onChange={handleImageCapture}
                className="hidden"
                ref={fileInputRef}
                capture="environment"
            />

            {renderModal()}
        </div>
    );
};

export default Scan;