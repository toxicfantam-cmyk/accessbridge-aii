import express from 'express';
import { register, login, getProfile, updatePreferences, demoLogin } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/demo', demoLogin);
router.get('/profile', authenticateToken, getProfile);
router.put('/preferences', authenticateToken, updatePreferences);

export default router;
