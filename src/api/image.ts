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
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
    }
  
    // 파일 크기 검증
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    files.forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`파일 크기가 너무 큽니다: ${file.name}`);
      }
    });
  
    const formData = new FormData();
    formData.append('title', title);
    
    files.forEach((file, index) => {
      formData.append(`files`, file); // 서버 API 스펙에 맞게 필드명 확인 필요
    });
  
    try {
      const { data } = await axiosInstance.post<ImageUploadResponse>('/images/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      });
      
      return data;
    } catch (error: any) {
      console.error('Upload error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });
  
      if (error.response?.status === 422) {
        throw new Error('토큰이 유효하지 않습니다. 다시 로그인해주세요.');
      } else if (error.response?.status === 500) {
        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
      
      // 서버에서 반환하는 에러 메시지가 있다면 사용
      const serverMessage = error.response?.data?.message || error.response?.data?.error;
      throw new Error(serverMessage || '이미지 업로드 중 오류가 발생했습니다.');
    }
  };