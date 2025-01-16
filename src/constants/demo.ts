// src/config/demo.ts
import { uploadInstance } from '../api/axios';

export const DEMO_MODE = process.env.REACT_APP_DEMO_MODE === 'true';

interface DemoUploadResponse {
    file_id: string;
    message: string;
}

interface UploadImageItem {
    file: File;
    vertices?: { x: number; y: number }[];
}

export const uploadDemoImage = async (
    file: File,
    vertices: { x: number; y: number }[]
): Promise<void> => {
    if (!DEMO_MODE) return;

    try {
        const formData = new FormData();
        formData.append('storage_name', '영감');
        formData.append('title', 'demo');  // 데모용 기본 제목

        // 단일 파일이지만 배열 형태로 vertices 데이터 구성
        const files: UploadImageItem[] = [{
            file,
            vertices
        }];
        
        // vertices 데이터 배열로 전송
        const pagesData = files.map(item => item.vertices || null);
        formData.append('pages_vertices_data', JSON.stringify(pagesData));

        // 파일 추가
        files.forEach(item => {
            if (item.file.size > 50 * 1024 * 1024) {
                throw new Error('파일 크기가 너무 큽니다. 50MB 이하의 파일만 업로드 가능합니다.');
            }
            formData.append('files', item.file);
        });

        await uploadInstance.post<DemoUploadResponse>(
            '/images/upload',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        console.log('Upload progress:', percent + '%');
                    }
                }
            }
        );
    } catch (error) {
        console.warn('Demo upload failed:', error);
        throw error;  // 에러를 상위로 전파하여 처리
    }
};