import { useState } from 'react';
import { uploadImages } from '../api/image';

interface PhotoFile {
    id: string;
    data: string;
}

interface UploadStatus {
    success: boolean;
    message: string;
}

interface UploadResult {
    message: string;
    // 기타 API 응답 필드들
}

export const UPLOAD_CONSTANTS = {
    MAX_TOTAL_SIZE: 10 * 1024 * 1024, // 10MB
    MIN_FILE_SIZE: 100, // 100 bytes
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg'],
} as const;

export const usePhotoUpload = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);

    // 파일 유효성 검사
    const validateFiles = (files: File[]): string | null => {
        // 파일 존재 여부 확인
        if (files.length === 0) {
            return '업로드할 파일이 없습니다.';
        }

        // 각 파일 크기 확인
        const validFiles = files.filter(file => file.size >= UPLOAD_CONSTANTS.MIN_FILE_SIZE);
        if (validFiles.length === 0) {
            return '유효한 이미지 파일이 없습니다.';
        }

        // 전체 크기 확인
        const totalSize = files.reduce((sum, file) => sum + file.size, 0);
        if (totalSize > UPLOAD_CONSTANTS.MAX_TOTAL_SIZE) {
            return '전체 파일 크기가 제한을 초과했습니다.';
        }

        return null;
    };

    // Base64를 File 객체로 변환
    const convertBase64ToFile = async (photos: PhotoFile[]): Promise<File[]> => {
        const filePromises = photos.map(async (photo) => {
            const base64Response = await fetch(photo.data);
            const blob = await base64Response.blob();
            return new File([blob], `photo-${photo.id}.jpg`, {
                type: 'image/jpeg'
            });
        });

        return Promise.all(filePromises);
    };

    // 이미지 업로드 처리
    const handleUpload = async (photos: PhotoFile[]): Promise<boolean> => {
        if (isLoading || photos.length === 0) return false;

        setIsLoading(true);
        setUploadStatus(null);

        try {
            // Base64 -> File 변환
            const files = await convertBase64ToFile(photos);

            // 파일 유효성 검사
            const validationError = validateFiles(files);
            if (validationError) {
                throw new Error(validationError);
            }

            // 이미지 업로드 API 호출
            const response = await uploadImages({
                title: "촬영된 이미지들",
                files,
            });

            setUploadStatus({
                success: true,
                message: response.message,
            });

            return true;

        } catch (error: any) {
            let errorMessage: string;

            if (error?.response?.status === 401) {
                // 401 에러는 axios interceptor에서 처리
                return false;
            }

            // API 에러 메시지 처리
            errorMessage = error?.response?.data?.detail?.[0]?.msg
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

    // 상태 초기화
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