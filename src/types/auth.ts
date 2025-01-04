interface Token {
  access_token: string;
  token_type: 'bearer';
}

export interface SignInResponse {
  message: string;
  token: Token;
}

// 나머지 타입들은 그대로 유지
export interface SignIn {
  email: string;
  password: string;
}

export interface SignUp {
  email: string;
  nickname: string;
  password: string;
  password_confirmation: string;
}

export interface AuthError {
  email?: string;
  password?: string;
  password_confirmation?: string;
  apiError?: string;
  nickname?: string;
}