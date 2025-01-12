import axios from 'axios';

const BASE_URL = 'https://nongmo-a2d.com/';

export const refreshAccessToken = async (): Promise<string | null> => {
  const refresh_token = localStorage.getItem('refresh_token');
  if (!refresh_token) {
    return null;
  }

  try {
    const { data } = await axios.post(`${BASE_URL}auth/refresh`, {
      refresh_token
    });
    
    if (data.data?.access_token) {
      localStorage.setItem('access_token', data.data.access_token);
      return data.data.access_token;
    }
    return null;
  } catch (error) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return null;
  }
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem('access_token');
};

export const setTokens = (access_token: string, refresh_token: string): void => {
  localStorage.setItem('access_token', access_token);
  localStorage.setItem('refresh_token', refresh_token);
};

export const clearTokens = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};