export type AssetType = 'real_estate' | 'stock' | 'cryptocurrency' | 'vehicle' | 'other';

export interface Asset {
  id: string;
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