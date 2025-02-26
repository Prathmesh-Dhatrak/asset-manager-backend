import fileService from './file.service';
import config from '../config/app.config';
import { hashPassword, comparePassword } from '../utils/password.utils';
import { generateToken } from '../utils/jwt.utils';
import { User, UserDTO, CreateUserDTO, LoginDTO, AuthResponse } from '../types/user.types';

class AuthService {
    private readonly userFilePath = config.dataPath.users;

    /**
     * Converts a User to UserDTO (removes sensitive data)
     * @param user User with sensitive data
     * @returns UserDTO without sensitive data
     */
    private toUserDTO(user: User): UserDTO {
        const { password, ...userDTO } = user;
        return userDTO;
    }

    /**
     * Registers a new user
     * @param userData User registration data
     * @returns Auth response with token and user data
     */
    async register(userData: CreateUserDTO): Promise<AuthResponse> {
        // Check if user already exists
        const existingUser = await this.findUserByEmail(userData.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await hashPassword(userData.password);

        // Create new user
        const newUser = await fileService.create<User>(this.userFilePath, {
            ...userData,
            password: hashedPassword,
        });

        // Generate token
        const token = generateToken({
            id: newUser.id,
            email: newUser.email,
        });

        return {
            token,
            user: this.toUserDTO(newUser),
        };
    }

    /**
     * Authenticates a user
     * @param credentials Login credentials
     * @returns Auth response with token and user data
     */
    async login(credentials: LoginDTO): Promise<AuthResponse> {
        // Find user by email
        const user = await this.findUserByEmail(credentials.email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Verify password
        const isPasswordValid = await comparePassword(credentials.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        // Generate token
        const token = generateToken({
            id: user.id,
            email: user.email,
        });

        return {
            token,
            user: this.toUserDTO(user),
        };
    }

    /**
     * Finds a user by ID
     * @param id User ID
     * @returns User DTO or null
     */
    async findUserById(id: string): Promise<UserDTO | null> {
        const user = await fileService.findById<User>(this.userFilePath, id);
        return user ? this.toUserDTO(user) : null;
    }

    /**
     * Finds a user by email
     * @param email User email
     * @returns User or null
     */
    async findUserByEmail(email: string): Promise<User | null> {
        const users = await fileService.readData<User>(this.userFilePath);
        const user = users.find((user) => user.email === email);
        return user || null;
    }
}

export default new AuthService();