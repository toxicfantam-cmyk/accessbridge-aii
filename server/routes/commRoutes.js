import express from 'express';
import { bridgeMessage } from '../controllers/commController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/bridge', optionalAuth, bridgeMessage);

export default router;
