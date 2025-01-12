import axiosInstance from './axios';
import { SignUp, SignIn, SignInResponse } from '../types/auth';
import { setTokens, clearTokens } from '../services/tokenService';

export const signUp = async (userData: SignUp): Promise<void> => {
  const response = await axiosInstance.post('https://nongmo-a2d.com/auth/signup', userData);
  return response.data;
};

export const signIn = async (credentials: SignIn): Promise<SignInResponse> => {
  const { data } = await axiosInstance.post<SignInResponse>('https://nongmo-a2d.com/auth/signin', credentials);
  
  if (data.data?.access_token && data.data?.refresh_token) {
    setTokens(data.data.access_token, data.data.refresh_token);
  }
  
  return data;
};

export const signOut = (): void => {
  clearTokens();
  window.dispatchEvent(new CustomEvent('auth:logout'));
};