import axiosInstance from './axios';

interface UploadImagesParams {
  title: string;
  files: File[];
}

interface ImageUploadResponse {
  file_id: string;
  message: string;
}

export const uploadImages = async ({ title, files }: UploadImagesParams): Promise<ImageUploadResponse> => {
  const formData = new FormData();
  formData.append('title', title);
  
  files.forEach(file => {
    formData.append('files', file);
  });

  // localStorage에서 토큰을 가져와서 요청 헤더에 추가
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
  }

  try {
    const { data } = await axiosInstance.post<ImageUploadResponse>('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    
    return data;
  } catch (error: any) {
    if (error.response?.status === 422) {
      throw new Error('토큰이 유효하지 않습니다. 다시 로그인해주세요.');
    }
    throw error;
  }
};