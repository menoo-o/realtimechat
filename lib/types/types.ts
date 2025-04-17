//Login Page export type LoginState = {
 
export type LoginState = {
  error: string | null;
};

// SignUp Page
export type RegisterState = {
  error: string | null;
  success?: boolean; // <-- optional success flag
};

export interface UserInfo {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    email_confirmed_at: string | null;
  }
  

  