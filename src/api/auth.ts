import axiosInstance from './axios';
import { SignUp, SignIn, SignInResponse } from '../types/auth';

export const signUp = async (userData: SignUp): Promise<void> => {
  const response = await axiosInstance.post('/auth/signup', userData);
  return response.data;
};

export const signIn = async (credentials: SignIn): Promise<SignInResponse> => {
  const { data } = await axiosInstance.post<SignInResponse>('/auth/signin', credentials);
  
  // 실제 응답 구조에 맞게 토큰 저장
  if (data.token) { // 또는 서버에서 주는 실제 토큰 필드명으로 수정
    localStorage.setItem('token', data.token);
    console.log('토큰 저장됨:', data.token);
  }
  
  return data;
};