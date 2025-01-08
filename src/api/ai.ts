import axiosInstance from './axios'; // axios 인스턴스를 가져옴

// fetchAIResponse 함수 정의
// 매개변수: userText (사용자가 입력한 텍스트)
// 반환값: AI 응답 텍스트 (Promise<string>)
export const fetchAIResponse = async (userText: string): Promise<string> => {
    // [01.08 19:58 | 류병현] 해당 변수에서 API 요청/응답을 처리하면 됩니다.

    try {
        // 실제 API 호출 대신 더미 데이터 반환
        const dummyResponse = "이것은 더미 응답입니다.";
        console.log('AI Response:', dummyResponse); // 응답 확인
        return dummyResponse; // 더미 응답 반환
    } catch (error) {
        console.error('Error fetching AI response:', error); // 오류 로그 출력
        throw error; // 오류 던지기
    }
};