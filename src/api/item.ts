import axiosInstance from "./axios";

interface BookItemResponse {
    storageName: string;
    fileList: string[];
}

export const getItems = async (collectionType: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
    }

    try {
        const {data} = await axiosInstance.get<BookItemResponse>(`/storage/${collectionType}`);
        console.log("Response Data:", data);
        return data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
        }
        if (error.response?.status === 404) {
            throw new Error('요청하신 데이터를 찾을 수 없습니다.');
        }
    }
    throw new Error('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
}