export const ROUTES = {
    INTRO: {
        path: '/intro',
        title: 'Analog To Digital',
        ko: '아날로그 데이터의 디지털화'
    },
    HOME: {
        path: '/home',
        title: 'Home',
        ko: '홈'
    },
    SIGN_IN: {
        path: '/signin',
        title: 'Sign In',
        ko: '로그인'
    },
    SIGN_UP: {
        path: '/signup',
        title: 'Sign Up',
        ko: '회원가입'
    },
    SCAN: {
        path: '/scan',
        title: 'Scan',
        ko: '스캔'
    },
    SCAN_VERTEX: {
        path:'/vertex',
        title: 'Scan Vertex',
        ko: '영역 조정'
    },
    LIBRARY: {
        BOOK: {
            path: '/library/book',
            title: 'Book Library',
            ko: '내 서재'
        },
        RECEIPT: {
            path: '/library/receipt',
            title: 'Receipt Archive',
            ko: '영수증 보관함'
        }
    },
    PLAYER: {
        path : '/player',
        AUDIO: {
            path: '/audio',
            title: 'Audio Player',
            ko: '플레이어'
        },
        PDF: {
            path: '/pdf',
            title: 'PDF Player',
            ko: 'PDF 뷰'
        }
    },
    AI_ASSISTANT: {
        path : '/ai-assistant',
        title: 'AI 어시스턴트',
        ko: 'AI 어시스턴트'
    }
} as const;

export const API_TYPE = {
    BOOK: 'book',
    RECEIPT: 'receipt'
} as const;