import axiosInstance from './axios';

export const fetchAIResponse = async (userText: string): Promise<string> => {
    try {
        // 실제 API 호출 대신 더미 데이터 반환
        const dummyResponse = "이것은 더미 응답입니다.";
        console.log('AI Response:', dummyResponse); // 응답 확인
        return dummyResponse;
    } catch (error) {
        console.error('Error fetching AI response:', error);
        throw error;
    }
};