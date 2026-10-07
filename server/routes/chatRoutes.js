import express from 'express';
import { askDocumentQuestion, getChatHistory } from '../controllers/chatController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/:transformationId', optionalAuth, getChatHistory);
router.post('/:transformationId', optionalAuth, askDocumentQuestion);

export default router;
