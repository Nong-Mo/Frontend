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

  // 파일 유효성 검사
  if (!files.length) {
    throw new Error('업로드할 파일을 선택해주세요.');
  }

  const formData = new FormData();
  formData.append('title', title);
  
  // 각 파일을 개별적으로 추가
  files.forEach((file, index) => {
    // 파일 확장자 확인
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !['jpg', 'jpeg', 'png'].includes(extension)) {
      throw new Error('지원하지 않는 파일 형식입니다. JPG 또는 PNG 파일만 업로드 가능합니다.');
    }

    // 파일 크기 확인 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('파일 크기가 너무 큽니다. 5MB 이하의 파일만 업로드 가능합니다.');
    }

    // 파일 이름 생성 (인덱스 포함)
    const timestamp = Date.now();
    const newFileName = `photo_${timestamp}_${index}`;
    formData.append('files', file, newFileName);
  });

  try {
    // FormData 내용 로깅
    let totalSize = 0;
    console.log('Uploading files:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        totalSize += value.size;
        console.log(`- ${value.name} (${(value.size / 1024).toFixed(2)}KB)`);
      }
    }
    console.log(`Total upload size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);

    const { data } = await axiosInstance.post<ImageUploadResponse>(
      '/images/upload', 
      formData,
      {
        timeout: 30000,
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
    console.error('Upload error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: error.config ? {
        url: error.config.url,
        method: error.config.method,
      } : undefined,
      message: error.message
    });

    // 구체적인 에러 메시지 생성
    if (error.response?.status === 500) {
      const serverMessage = error.response?.data?.message || error.response?.data?.error;
      if (serverMessage?.includes('storage') || serverMessage?.includes('disk')) {
        throw new Error('서버 저장소에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
      throw new Error(serverMessage || '서버 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } else if (error.response?.status === 413) {
      throw new Error('파일의 총 크기가 너무 큽니다.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('업로드 시간이 초과되었습니다. 네트워크 상태를 확인해주세요.');
    }
    
    throw new Error('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
  }
};