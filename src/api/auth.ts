import axiosInstance from './axios';
import { SignUp, SignIn, SignInResponse } from '../types/auth';

export const signUp = async (userData: SignUp): Promise<void> => {
  const response = await axiosInstance.post('/auth/signup', userData);
  return response.data;
};

export const signIn = async (loginData: SignIn): Promise<SignInResponse> => {
  const response = await axiosInstance.post('/auth/signin', loginData);
  return response.data;
};