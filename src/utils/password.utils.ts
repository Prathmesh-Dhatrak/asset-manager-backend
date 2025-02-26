import bcrypt from 'bcryptjs';
import authConfig from '../config/auth.config';

/**
 * Hashes a plain text password
 * @param password Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(authConfig.saltRounds);
  return bcrypt.hash(password, salt);
};

/**
 * Compares a plain text password with a hashed password
 * @param password Plain text password
 * @param hashedPassword Hashed password
 * @returns Whether the passwords match
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};