import axiosInstance from './axios';

export const fetchAIResponse = async (userText: string): Promise<string> => {
    const response = await axiosInstance.post('/ai/response', { text: userText });
    return response.data.response;
};