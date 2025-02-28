// src/services/asset.service.ts
import { Types } from 'mongoose';
// import AssetModel from '../models/asset.model';
import AssetModel from '../models/asset.model';
import { Asset, CreateAssetDTO, UpdateAssetDTO, AssetQueryParams } from '../types/asset.types';

class AssetService {
  /**
   * Gets all assets for a user with optional filtering
   * @param userId User ID
   * @param queryParams Query parameters for filtering and sorting
   * @returns Filtered assets
   */
  async getAllAssets(userId: string, queryParams: AssetQueryParams = {}): Promise<Asset[]> {
    // Build query
    const query: any = { userId };
    
    // Add type filter if provided
    if (queryParams.type) {
      query.type = queryParams.type;
    }
    
    // Add value range filters if provided
    if (queryParams.minValue !== undefined || queryParams.maxValue !== undefined) {
      query.value = {};
      if (queryParams.minValue !== undefined) {
        query.value.$gte = queryParams.minValue;
      }
      if (queryParams.maxValue !== undefined) {
        query.value.$lte = queryParams.maxValue;
      }
    }
    
    // Text search if provided
    let findQuery = AssetModel.find(query);
    if (queryParams.search) {
      findQuery = AssetModel.find(
        {
          $and: [
            { userId },
            { $text: { $search: queryParams.search } }
          ]
        }
      );
    }
    
    // Apply sorting
    if (queryParams.sortBy) {
      const sortOrder = queryParams.sortOrder === 'desc' ? -1 : 1;
      const sortOptions: any = {};
      sortOptions[queryParams.sortBy] = sortOrder;
      findQuery = findQuery.sort(sortOptions);
    } else {
      // Default sort by updatedAt descending
      findQuery = findQuery.sort({ updatedAt: -1 });
    }
    
    // Execute query
    const assets = await findQuery.exec();
    
    // Return assets with correct interface (converting _id to id)
    return assets.map(asset => this.mapAssetDocument(asset));
  }

  /**
   * Gets a specific asset by ID
   * @param userId User ID
   * @param assetId Asset ID
   * @returns Asset or null
   */
  async getAssetById(userId: string, assetId: string): Promise<Asset | null> {
    if (!Types.ObjectId.isValid(assetId)) {
      return null;
    }
    
    const asset = await AssetModel.findOne({ 
      _id: new Types.ObjectId(assetId),
      userId 
    }).exec();
    
    if (!asset) {
      return null;
    }
    
    return this.mapAssetDocument(asset);
  }

  /**
   * Creates a new asset
   * @param userId User ID
   * @param assetData Asset data
   * @returns Created asset
   */
  async createAsset(userId: string, assetData: CreateAssetDTO): Promise<Asset> {
    const newAsset = new AssetModel({
      ...assetData,
      userId
    });
    
    await newAsset.save();
    
    return this.mapAssetDocument(newAsset);
  }

  /**
   * Updates an asset
   * @param userId User ID
   * @param assetId Asset ID
   * @param assetData Updated asset data
   * @returns Updated asset
   */
  async updateAsset(
    userId: string,
    assetId: string,
    assetData: UpdateAssetDTO
  ): Promise<Asset> {
    if (!Types.ObjectId.isValid(assetId)) {
      throw new Error('Invalid asset ID');
    }
    
    const updatedAsset = await AssetModel.findOneAndUpdate(
      { _id: new Types.ObjectId(assetId), userId },
      { $set: { ...assetData, updatedAt: new Date() } },
      { new: true } // Return the updated document
    ).exec();
    
    if (!updatedAsset) {
      throw new Error('Asset not found or does not belong to the user');
    }
    
    return this.mapAssetDocument(updatedAsset);
  }

  /**
   * Deletes an asset
   * @param userId User ID
   * @param assetId Asset ID
   * @returns Whether deletion was successful
   */
  async deleteAsset(userId: string, assetId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(assetId)) {
      throw new Error('Invalid asset ID');
    }
    
    const result = await AssetModel.deleteOne({ 
      _id: new Types.ObjectId(assetId), 
      userId 
    }).exec();
    
    if (result.deletedCount === 0) {
      throw new Error('Asset not found or does not belong to the user');
    }
    
    return true;
  }

  /**
   * Maps a Mongoose asset document to the Asset interface
   * @param assetDoc Mongoose asset document
   * @returns Asset object
   */
  private mapAssetDocument(assetDoc: any): Asset {
    const asset = assetDoc.toObject();
    return {
      id: asset._id.toString(),
      userId: asset.userId,
      name: asset.name,
      type: asset.type,
      value: asset.value,
      description: asset.description,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt
    };
  }
}

export default new AssetService();