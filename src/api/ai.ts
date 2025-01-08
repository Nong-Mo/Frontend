import axiosInstance from './axios'; // axios 인스턴스를 가져옴

// fetchAIResponse 함수 정의
// 매개변수: userText (사용자가 입력한 텍스트)
// 반환값: AI 응답 텍스트 (Promise<string>)

export const fetchAIResponse = async (userText: string): Promise<string> => {
    const token = localStorage.getItem('token'); // 토큰을 로컬 스토리지에서 가져옴

    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await axiosInstance.post(
            '/llm/query',
            { query: userText }, // userText를 쿼리로 사용
            {
                headers: {
                    token,
                },
            }
        );
        return response.data.response; // 응답 텍스트 반환
    } catch (error) {
        console.error('Error querying LLM:', error); // 오류 로그 출력
        throw error; // 오류 던지기
    }
};
