import axiosInstance from './axios';
import { SignUp, SignIn, SignInResponse } from '../types/auth';
import { API_BASE_URL } from '../constants/config';

export const signUp = async (userData: SignUp): Promise<void> => {
    const response = await axiosInstance.post(`${API_BASE_URL}/auth/signup`, userData);
    return response.data;
};

export const signIn = async (credentials: SignIn): Promise<{ data: SignInResponse }> => {
    return await axiosInstance.post<SignInResponse>(`${API_BASE_URL}/auth/signin`, credentials);
};

export const verifyToken = async (): Promise<void> => {
    const token = sessionStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }
    
    try {
        await axiosInstance.get(`${API_BASE_URL}/auth/verify`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (error) {
        sessionStorage.removeItem('token');
        throw error;
    }
};