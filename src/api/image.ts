import {uploadInstance} from "./axios";
import {API_TYPE, ROUTES} from "../routes/constants.ts";

interface UploadImageItem {
  file: File;
  vertices?: { x: number; y: number }[];
}

interface UploadImagesParams {
  title: string;
  files: UploadImageItem[];
  type: string;
}

interface ImageUploadResponse {
  file_id: string;
  message: string;
}

export const uploadImages = async ({title, files, type}: UploadImagesParams): Promise<ImageUploadResponse> => {
  const formData = new FormData();
  
  // FormData 구성
  files.forEach((item, index) => {
    const file = item.file;
    const fileExtension = file.name.split('.').pop();
    const safeFileName = `file-${index}.${fileExtension}`;
    
    if (file.size > 50 * 1024 * 1024) {
      throw new Error('파일 크기가 너무 큽니다. 50MB 이하의 파일만 업로드 가능합니다.');
    }

    // 파일 추가
    formData.append(`files`, file, safeFileName);
    
    // vertices가 있는 경우 추가
    if (item.vertices) {
        // 모든 vertices 정보를 하나의 배열로 모아서 전송
    const pagesData = files.map(item => item.vertices || null);
    formData.append('pages_vertices_data', JSON.stringify(pagesData));
    }
  });
  
  formData.append('storage_name', type === API_TYPE.NOVEL ? "소설" : "영감");
  formData.append('title', title);
  
  try {
    const response = await uploadInstance.post<ImageUploadResponse>(
      '/images/upload',
      formData,
      {
        headers: {
          'Accept': 'application/json',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            // 진행률 처리가 필요한 경우 여기에 추가
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload progress: ${percentCompleted}%`);
          }
        }
      }
    );
    
    return response.data;
  } catch (error: any) {
    console.error('Upload error:', error.response?.data || error.message);
    throw error;
  }
};