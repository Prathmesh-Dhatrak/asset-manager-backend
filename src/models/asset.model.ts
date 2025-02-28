import mongoose, { Schema, Document } from 'mongoose';
import { Asset } from '../types/asset.types';

export interface AssetDocument extends Omit<Asset, 'id'>, Document {}
const assetSchema = new Schema({
  userId: { 
    type: String, 
    required: true,
    index: true
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
  timestamps: true,
  versionKey: false
});

assetSchema.index({ userId: 1, type: 1 });
assetSchema.index({ userId: 1, value: 1 });
assetSchema.index({ userId: 1, name: 'text' });

export default mongoose.model<AssetDocument>('Asset', assetSchema);