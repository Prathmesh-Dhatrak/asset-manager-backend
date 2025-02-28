// src/services/auth.service.ts
import { Types } from 'mongoose';
import UserModel, { UserDocument } from '../models/user.model';
import { hashPassword, comparePassword } from '../utils/password.utils';
import { generateToken } from '../utils/jwt.utils';
import { User, UserDTO, CreateUserDTO, LoginDTO, AuthResponse } from '../types/user.types';

class AuthService {
    /**
     * Converts a User to UserDTO (removes sensitive data)
     * @param user User with sensitive data
     * @returns UserDTO without sensitive data
     */
    private toUserDTO(user: UserDocument): UserDTO {
        const userObj = user.toObject();
        const { password, _id, ...rest } = userObj;
        return {
            id: _id.toString(),
            ...rest
        };
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
        const newUser:any = new UserModel({
            ...userData,
            password: hashedPassword,
        });
        
        await newUser.save();

        // Generate token
        const token = generateToken({
            id: newUser._id.toString(),
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
        const user: any = await this.findUserByEmail(credentials.email);
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
            id: user._id.toString(),
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
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }
        
        const user = await UserModel.findById(id).exec();
        return user ? this.toUserDTO(user) : null;
    }

    /**
     * Finds a user by email
     * @param email User email
     * @returns User document or null
     */
    async findUserByEmail(email: string): Promise<UserDocument | null> {
        return UserModel.findOne({ email: email.toLowerCase() }).exec();
    }
}

export default new AuthService();