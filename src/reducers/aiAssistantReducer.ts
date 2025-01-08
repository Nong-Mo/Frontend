// State 인터페이스 정의
// messages: 메시지 배열, 각 메시지는 sender와 text를 가짐
// inputText: 입력된 텍스트
// isLoading: 로딩 상태
interface State {
    messages: { sender: string; text: string }[];
    inputText: string;
    isLoading: boolean;
}

// Action 인터페이스 정의
// type: 액션 타입
// payload: 액션에 포함된 데이터 (선택적)
interface Action {
    type: string;
    payload?: any;
}

// 초기 상태 정의
export const initialState: State = {
    messages: [],
    inputText: '',
    isLoading: false,
};

// 리듀서 함수 정의
// 매개변수: state (현재 상태), action (디스패치된 액션)
// 반환값: 새로운 상태
export const aiAssistantReducer = (state: State, action: Action): State => {
    switch (action.type) {
        // 입력 텍스트 설정
        case 'SET_INPUT_TEXT':
            return { ...state, inputText: action.payload };
        // 메시지 추가
        case 'ADD_MESSAGE':
            return { ...state, messages: [...state.messages, action.payload] };
        // 로딩 상태 설정
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        // 상태 초기화
        case 'RESET':
            return initialState;
        // 기본 상태 반환
        default:
            return state;
    }
};