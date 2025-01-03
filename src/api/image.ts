import axiosInstance, { uploadInstance } from "./axios";

interface UploadImagesParams {
  title: string;
  files: File[];
}

interface ImageUploadResponse {
  file_id: string;
  message: string;
}

// 이미지 업로드 함수
// title과 files를 인자로 받아 서버에 이미지 파일을 업로드
export const uploadImages = async ({ title, files }: UploadImagesParams): Promise<ImageUploadResponse> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
  }

  const formData = new FormData();
  formData.append('title', title);
  
  for (const file of files) {
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('파일 크기가 너무 큽니다. 5MB 이하의 파일만 업로드 가능합니다.');
    }
    formData.append('files', file);
  }

  // axios 인스턴스를 사용해 서버에 POST 요청
  try {
    const { data } = await uploadInstance.post<ImageUploadResponse>(
      '/images/upload',
      formData,
      {
        headers: {
        },
        // 단순히 파일 업로드 진행률을 콘솔에 출력하기 위한 콜백 함수
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload progress: ${percent}%`);
          }
        }
      }
    );
    
    return data;
  } catch (error: any) {
    let errorMessage = '글자가 잘 나오도록 다시 찍어 주세요! 😊';
 
      if (error.response?.data?.detail && Array.isArray(error.response.data.detail) && error.response.data.detail.length > 0) {
          errorMessage = error.response.data.detail[0].msg;
     }  else if (error.message) {
         errorMessage = error.message;
     }
       throw new Error(errorMessage);
   }
};