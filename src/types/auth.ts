interface Token {
  access_token: string;
  token_type: 'bearer';
}

export interface SignInResponse {
  access_token: string;
  token_type: string;
  message: string;
  status: string;
}

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

export interface TokenResponse {
  status: string;
  message: string;
  data: {
    access_token: string;
  }
}

export interface SignInResponse {
  status: string;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
  }
}