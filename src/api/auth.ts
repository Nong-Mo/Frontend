import axiosInstance from './axios';
import { SignUp, SignIn, SignInResponse } from '../types/auth';

export const signUp = async (userData: SignUp): Promise<void> => {
  const response = await axiosInstance.post('/auth/signup', userData);
  return response.data;
};

export const signIn = async (credentials: SignIn): Promise<SignInResponse> => {
  const { data } = await axiosInstance.post<SignInResponse>('/auth/signin', credentials);
  return data as SignInResponse;
};