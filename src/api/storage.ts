export interface StorageItem {
    storageName: string;
    fileCount: number;
  }
  
  export interface StorageResponse {
    nickname: string;
    storageList: StorageItem[];
  }
  
  // Storage API 함수
  export const getStorageList = async (): Promise<StorageResponse> => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No token found');
    }
  
    try {
      const response = await fetch('https://nongmo-a2d.com/storage/list', {
        method: 'GET',
        headers: {
          'token': `${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
  
      // 응답 상태 체크
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // 응답 타입 체크
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error('Received non-JSON response:', text);
        throw new Error('Received non-JSON response from server');
      }
  
      const data: StorageResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching storage list:', error);
      throw error;
    }
  };