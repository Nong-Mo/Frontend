import {useState} from 'react';
import {uploadImages} from '../api/image';

interface PhotoFile {
    id: string;
    data: string;
    vertices?: {
        x: number;
        y: number;
    }[];
}

interface UploadStatus {
    success: boolean;
    message: string;
}

interface UploadOptions {
    title: string;
    files: {
        file: File;
        vertices?: { x: number; y: number }[];
    }[];
}

export const UPLOAD_CONSTANTS = {
    MAX_TOTAL_SIZE: 50 * 1024 * 1024, // 10MB
    MIN_FILE_SIZE: 100, // 100 bytes
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg'],
} as const;

export const usePhotoUpload = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);

    // 파일 유효성 검사
    const validateFiles = (files: { file: File }[]): string | null => {
        if (files.length === 0) {
            return '업로드할 파일이 없습니다.';
        }

        const validFiles = files.filter(item => item.file.size >= UPLOAD_CONSTANTS.MIN_FILE_SIZE);
        if (validFiles.length === 0) {
            return '유효한 이미지 파일이 없습니다.';
        }

        const totalSize = files.reduce((sum, item) => sum + item.file.size, 0);
        if (totalSize > UPLOAD_CONSTANTS.MAX_TOTAL_SIZE) {
            return '전체 파일 크기가 제한을 초과했습니다.';
        }

        return null;
    };

    // Base64를 File 객체로 변환
    const convertBase64ToFile = async (photos: PhotoFile[]): Promise<{ file: File, vertices?: { x: number, y: number }[] }[]> => {
        const filePromises = photos.map(async (photo) => {
            const base64Response = await fetch(photo.data);
            const blob = await base64Response.blob();
            const file = new File([blob], `photo-${photo.id}.jpg`, {
                type: 'image/jpeg'
            });
            return { file, vertices: photo.vertices };
        });

        return Promise.all(filePromises);
    };

    // 이미지 업로드 처리
    const handleUpload = async (photos: PhotoFile[], title: string, type : number): Promise<boolean> => {
        if (isLoading || photos.length === 0) return false;

        setIsLoading(true);
        setUploadStatus(null);

        try {
            // Base64 -> File 변환
            const filesWithVertices = await convertBase64ToFile(photos);

            // 파일 유효성 검사
            const validationError = validateFiles(filesWithVertices);
            if (validationError) {
                throw new Error(validationError);
            }

            // 이미지 업로드 API 호출
            const response = await uploadImages({
                title,
                files: filesWithVertices,
                type
            });

            setUploadStatus({
                success: true,
                message: response.message,
            });

            return true;

        } catch (error: any) {
            if (error?.response?.status === 401) {
                return false;
            }

            const errorMessage = error?.response?.data?.detail?.[0]?.msg
                ?? error.message
                ?? "이미지 업로드에 실패했습니다. 다시 시도해주세요.";

            setUploadStatus({
                success: false,
                message: errorMessage,
            });

            return false;

        } finally {
            setIsLoading(false);
        }
    };

    const resetUploadState = () => {
        setIsLoading(false);
        setUploadStatus(null);
    };

    return {
        isLoading,
        uploadStatus,
        handleUpload,
        resetUploadState,
    };
};