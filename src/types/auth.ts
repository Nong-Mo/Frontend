export interface SignUp {
    email: string;
    nickname: string;
    password: string;
    password_confirmation: string;
  }
  
  export interface SignIn {
    email: string;
    password: string;
  }
  
  export interface SignInResponse {
    access_token: string;
    token_type: string;
  }
  
  export interface AuthError {
    email?: string;
    password?: string;
    nickname?: string;
    password_confirmation?: string;
    apiError?: string;
  }