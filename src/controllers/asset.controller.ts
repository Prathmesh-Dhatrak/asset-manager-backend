import { Request, Response } from 'express';
import assetService from '../services/asset.service';
import { AuthRequest } from '../types/request.types';
import { AssetQueryParams, CreateAssetDTO, UpdateAssetDTO } from '../types/asset.types';

/**
 * Controller for asset management endpoints
 */
class AssetController {
  /**
   * Get all assets for the current user
   */
  async getAllAssets(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      
      // Parse query parameters
      const queryParams: AssetQueryParams = {
        search: req.query.search as string,
        type: req.query.type as any,
        minValue: req.query.minValue ? Number(req.query.minValue) : undefined,
        maxValue: req.query.maxValue ? Number(req.query.maxValue) : undefined,
        sortBy: req.query.sortBy as any,
        sortOrder: req.query.sortOrder as any,
      };
      
      const assets = await assetService.getAllAssets(req.user.id, queryParams);
      
      res.status(200).json(assets);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Get a specific asset by ID
   */
  async getAssetById(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      
      const assetId = req.params.id;
      const asset = await assetService.getAssetById(req.user.id, assetId);
      
      if (!asset) {
        res.status(404).json({ message: 'Asset not found' });
        return;
      }
      
      res.status(200).json(asset);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Create a new asset
   */
  async createAsset(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      
      const assetData: CreateAssetDTO = req.body;
      const newAsset = await assetService.createAsset(req.user.id, assetData);
      
      res.status(201).json(newAsset);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Update an existing asset
   */
  async updateAsset(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      
      const assetId = req.params.id;
      const assetData: UpdateAssetDTO = req.body;
      
      const updatedAsset = await assetService.updateAsset(req.user.id, assetId, assetData);
      
      res.status(200).json(updatedAsset);
    } catch (error: any) {
      if (error.message.includes('not found')) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  }

  /**
   * Delete an asset
   */
  async deleteAsset(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      
      const assetId = req.params.id;
      const success = await assetService.deleteAsset(req.user.id, assetId);
      
      if (!success) {
        res.status(404).json({ message: 'Asset not found' });
        return;
      }
      
      res.status(200).json({ success: true });
    } catch (error: any) {
      if (error.message.includes('not found')) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  }
}

export default new AssetController();