import * as jwt from 'jsonwebtoken';
import authConfig from '../config/auth.config';

interface TokenPayload {
  id: string;
  email: string;
}

/**
 * Generates a JWT token
 * @param payload User information to include in the token
 * @returns JWT token
 */
export const generateToken = (payload: TokenPayload): string => {
  // Using any to bypass TypeScript's type checking for jwt.sign
  const secret: any = authConfig.jwtSecret;
  const options: any = { expiresIn: authConfig.jwtExpiration };
  
  return jwt.sign(payload, secret, options);
};

/**
 * Verifies a JWT token
 * @param token JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    // Using any to bypass TypeScript's type checking for jwt.verify
    const secret: any = authConfig.jwtSecret;
    const decoded = jwt.verify(token, secret) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};