interface State {
    messages: { sender: string; text: string }[];
    inputText: string;
    isLoading: boolean;
}

interface Action {
    type: string;
    payload?: any;
}

export const initialState: State = {
    messages: [],
    inputText: '',
    isLoading: false,
};

export const aiAssistantReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_INPUT_TEXT':
            return { ...state, inputText: action.payload };
        case 'ADD_MESSAGE':
            return { ...state, messages: [...state.messages, action.payload] };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'RESET':
            return initialState;
        default:
            return state;
    }
};