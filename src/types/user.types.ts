export interface User {
    id: string;
    username: string;
    email: string;
    password: string; // Hashed password
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface UserDTO {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface CreateUserDTO {
    username: string;
    email: string;
    password: string;
  }
  
  export interface LoginDTO {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: UserDTO;
  }