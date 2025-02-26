import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { AuthRequest } from '../types/request.types';
import { CreateUserDTO, LoginDTO } from '../types/user.types';

/**
 * Controller for authentication-related endpoints
 */
class AuthController {
  /**
   * Register a new user
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUserDTO = req.body;
      const result = await authService.register(userData);
      
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Login a user
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const credentials: LoginDTO = req.body;
      const result = await authService.login(credentials);
      
      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  /**
   * Get the current user's information
   */
  async getMe(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      
      const user = await authService.findUserById(req.user.id);
      
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      
      res.status(200).json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new AuthController();