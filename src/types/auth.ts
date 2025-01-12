// src/types/auth.ts

export interface TokenData {
  access_token: string;
  token_type: string;
}

// 회원가입 응답 데이터 타입
export interface SignUpResponseData {
  email: string;
  nickname: string;
}

// 회원가입 응답 타입
export interface SignUpResponse {
  status: string;
  message: string;
  data: SignUpResponseData;
}

// 로그인 응답 타입
export interface SignInResponse {
  status: string;
  message: string;
  data: TokenData;
}

// 토큰 검증 응답 데이터 타입
export interface VerifyTokenResponseData {
  email: string;
  nickname: string;
}

// 토큰 검증 응답 타입
export interface VerifyTokenResponse {
  status: string;
  message: string;
  data: VerifyTokenResponseData;
}

// 로그인 요청 타입
export interface SignIn {
  email: string;
  password: string;
}

// 회원가입 요청 타입
export interface SignUp {
  email: string;
  nickname: string;
  password: string;
  password_confirmation: string;
}

// 에러 타입
export interface AuthError {
  email?: string;
  password?: string;
  password_confirmation?: string;
  nickname?: string;
  apiError?: string;
}