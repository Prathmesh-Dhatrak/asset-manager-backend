import express from 'express';
import assetController from '../controllers/asset.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateAssetCreation, validateAssetUpdate } from '../middleware/validation.middleware';

const router = express.Router();

// All asset routes require authentication
router.use(authMiddleware);

// GET /api/assets - Get all assets for the current user
router.get('/', assetController.getAllAssets);

// GET /api/assets/:id - Get a specific asset
router.get('/:id', assetController.getAssetById);

// POST /api/assets - Create a new asset
router.post('/', validateAssetCreation, assetController.createAsset);

// PUT /api/assets/:id - Update an asset
router.put('/:id', validateAssetUpdate, assetController.updateAsset);

// DELETE /api/assets/:id - Delete an asset
router.delete('/:id', assetController.deleteAsset);

export default router;