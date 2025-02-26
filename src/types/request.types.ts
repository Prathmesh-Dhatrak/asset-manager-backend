import { Request } from 'express';
import { User } from './user.types';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}