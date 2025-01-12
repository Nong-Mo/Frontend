import {uploadInstance} from "./axios";

interface UploadImageItem {
  file: File;
  vertices?: { x: number; y: number }[];
}

interface UploadImagesParams {
  title: string;
  files: UploadImageItem[];
  type: number;
}

interface ImageUploadResponse {
  file_id: string;
  message: string;
}

// 이미지 업로드 함수
// title과 files를 인자로 받아 서버에 이미지 파일을 업로드
// image.ts의 uploadImages 함수 수정
export const uploadImages = async ({title, files, type = 1}: UploadImagesParams): Promise<ImageUploadResponse> => {
  const API_DATA_TYPE = {
    BOOK: {
      API_PATH: '/images/upload',
      STORAGE_NAME: '책'
    },
    RECEIPT: {
      API_PATH: '/receipt/ocr',
      STORAGE_NAME: '영수증'
    }
  };
  const curr_api = (type === 1) ? API_DATA_TYPE.BOOK : API_DATA_TYPE.RECEIPT;
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
  }

  const formData = new FormData();
  formData.append('storage_name', curr_api.STORAGE_NAME);
  formData.append('title', title);

  // 모든 vertices 정보를 하나의 배열로 모아서 전송
  const pagesData = files.map(item => item.vertices || null);
  formData.append('pages_vertices_data', JSON.stringify(pagesData));

  // 파일들 추가
  files.forEach(item => {
    if (item.file.size > 50 * 1024 * 1024) {
      throw new Error('파일 크기가 너무 큽니다. 50MB 이하의 파일만 업로드 가능합니다.');
    }
    formData.append('files', item.file);
  });

  try {
    const {data} = await uploadInstance.post<ImageUploadResponse>(
        curr_api.API_PATH,
        formData,
        {
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
    throw new Error('글자가 잘 나오도록 다시 찍어 주세요! 😊');
  }
};