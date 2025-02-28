// src/models/asset.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import { Asset, AssetType } from '../types/asset.types';

// Interface for the MongoDB document with Mongoose-specific properties
export interface AssetDocument extends Omit<Asset, 'id'>, Document {}

// Create the asset schema
const assetSchema = new Schema({
  userId: { 
    type: String, 
    required: true,
    index: true // Index for faster queries by userId
  },
  name: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    required: true,
    enum: ['real_estate', 'stock', 'cryptocurrency', 'vehicle', 'other']
  },
  value: { 
    type: Number, 
    required: true 
  },
  description: { 
    type: String, 
    default: '' 
  }
}, { 
  timestamps: true, // This will automatically add createdAt and updatedAt fields
  versionKey: false // Removes the __v field
});

// Create indexes for common query patterns
assetSchema.index({ userId: 1, type: 1 });
assetSchema.index({ userId: 1, value: 1 });
assetSchema.index({ userId: 1, name: 'text' }); // Text index for search

// Create and export the model
export default mongoose.model<AssetDocument>('Asset', assetSchema);