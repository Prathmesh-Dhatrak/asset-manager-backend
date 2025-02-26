import express from 'express';
import authRoutes from './auth.routes';
import assetRoutes from './asset.routes';

const router = express.Router();

// Mount route groups
router.use('/auth', authRoutes);
router.use('/assets', assetRoutes);

export default router;