// src/models/user.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import { User } from '../types/user.types';

export interface UserDocument extends Omit<User, 'id'>, Document {}

const userSchema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true 
  },
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true 
  }
}, { 
  timestamps: true,
  versionKey: false
});


export default mongoose.model<UserDocument>('User', userSchema);