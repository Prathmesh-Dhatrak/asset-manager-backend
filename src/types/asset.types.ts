export type AssetType = 'real_estate' | 'stock' | 'cryptocurrency' | 'vehicle' | 'other';
import { Types } from 'mongoose';


export interface Asset {
  id?: string | Types.ObjectId;
  userId: string;
  name: string;
  type: AssetType;
  value: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAssetDTO {
  name: string;
  type: AssetType;
  value: number;
  description: string;
}

export interface UpdateAssetDTO {
  name?: string;
  type?: AssetType;
  value?: number;
  description?: string;
}

export interface AssetQueryParams {
  search?: string;
  type?: AssetType;
  minValue?: number;
  maxValue?: number;
  sortBy?: 'name' | 'type' | 'value' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}