import fileService from './file.service';
import config from '../config/app.config';
import { filterAssets } from '../utils/filter.utils';
import { Asset, CreateAssetDTO, UpdateAssetDTO, AssetQueryParams } from '../types/asset.types';

class AssetService {
  private readonly assetFilePath = config.dataPath.assets;

  /**
   * Gets all assets for a user with optional filtering
   * @param userId User ID
   * @param queryParams Query parameters for filtering and sorting
   * @returns Filtered assets
   */
  async getAllAssets(userId: string, queryParams: AssetQueryParams = {}): Promise<Asset[]> {
    // Get all assets for the user
    const assets = await fileService.query<Asset>(
      this.assetFilePath,
      (asset) => asset.userId === userId
    );
    
    // Apply filters and sorting
    return filterAssets(assets, queryParams);
  }

  /**
   * Gets a specific asset by ID
   * @param userId User ID
   * @param assetId Asset ID
   * @returns Asset or null
   */
  async getAssetById(userId: string, assetId: string): Promise<Asset | null> {
    const asset = await fileService.findById<Asset>(this.assetFilePath, assetId);
    
    // Check if asset exists and belongs to the user
    if (!asset || asset.userId !== userId) {
      return null;
    }
    
    return asset;
  }

  /**
   * Creates a new asset
   * @param userId User ID
   * @param assetData Asset data
   * @returns Created asset
   */
  async createAsset(userId: string, assetData: CreateAssetDTO): Promise<Asset> {
    const newAsset = await fileService.create<Asset>(this.assetFilePath, {
      ...assetData,
      userId,
    });
    
    return newAsset;
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
    // Check if asset exists and belongs to the user
    const asset = await this.getAssetById(userId, assetId);
    if (!asset) {
      throw new Error('Asset not found or does not belong to the user');
    }
    
    // Update asset
    const updatedAsset = await fileService.update<Asset>(
      this.assetFilePath,
      assetId,
      assetData
    );
    
    return updatedAsset;
  }

  /**
   * Deletes an asset
   * @param userId User ID
   * @param assetId Asset ID
   * @returns Whether deletion was successful
   */
  async deleteAsset(userId: string, assetId: string): Promise<boolean> {
    // Check if asset exists and belongs to the user
    const asset = await this.getAssetById(userId, assetId);
    if (!asset) {
      throw new Error('Asset not found or does not belong to the user');
    }
    
    // Delete asset
    return fileService.delete<Asset>(this.assetFilePath, assetId);
  }
}

export default new AssetService();