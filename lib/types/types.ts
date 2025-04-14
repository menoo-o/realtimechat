//Login Page 
export type LoginState = {
    error: string | null;
  };

// SignUp Page
export type RegisterState = {
    error: string | null;
  };
  

  export interface Message {
    id: string;
    content: string;
    created_at: string;
  }