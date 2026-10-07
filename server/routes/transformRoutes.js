import express from 'express';
import {
  createTransformation,
  getTransformations,
  getTransformationById,
  deleteTransformation
} from '../controllers/transformController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Allow optional auth so users can try transforming documents without forcing immediate signup
router.post('/', optionalAuth, upload.single('file'), createTransformation);

// Protected routes for saved user history
router.get('/', authenticateToken, getTransformations);
router.get('/:id', optionalAuth, getTransformationById);
router.delete('/:id', authenticateToken, deleteTransformation);

export default router;
