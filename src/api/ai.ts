import axiosInstance from './axios';

interface AIResponse {
    type: string;
    message: string;
    data: any | null;
}

export const fetchAIResponse = async (userText: string): Promise<AIResponse> => {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('Authentication required');
    }

    try {
        const response = await axiosInstance.post(
            '/llm/query',
            { query: userText },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                }
            }
        );

        // API 응답 형식에 맞게 수정
        if (!response.data) {
            throw new Error('Invalid response format');
        }

        return response.data;
    } catch (error: any) {
        console.error('Error querying LLM:', error);

        // 에러 응답 포맷 통일
        return {
            type: 'error',
            message: error.response?.data?.detail || 'AI 응답을 가져오는 중 오류가 발생했습니다.',
            data: null
        };
    }
};

export const startNewChat = async (): Promise<boolean> => {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('Authentication required');
    }

    try {
        const response = await axiosInstance.post(
            '/llm/new-chat',
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                }
            }
        );

        return response.status === 200;
    } catch (error) {
        console.error('Error starting new chat:', error);
        return false;
    }
};