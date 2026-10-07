import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isDbConnected, MemoryStore } from '../services/memoryStore.js';

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'accessbridge_super_secret_jwt_key_2026_hackathon_secure';
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      name: user.name
    },
    secret,
    { expiresIn: '7d' }
  );
};

export const register = async (req, res) => {
  try {
    const { name, email, password, preferences } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    if (isDbConnected()) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.'
        });
      }

      const user = new User({
        name,
        email: email.toLowerCase(),
        passwordHash,
        preferences: preferences || {}
      });

      await user.save();
      const token = generateToken(user);

      return res.status(201).json({
        success: true,
        message: 'User registered successfully.',
        token,
        user
      });
    } else {
      // In-Memory Mode
      const existing = await MemoryStore.findUserByEmail(email);
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.'
        });
      }

      const user = await MemoryStore.saveUser({
        name,
        email: email.toLowerCase(),
        passwordHash,
        preferences: preferences || {}
      });
      const token = generateToken(user);

      return res.status(201).json({
        success: true,
        message: 'User registered successfully (In-Memory).',
        token,
        user
      });
    }
  } catch (error) {
    console.error('[AuthController Register Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Registration failed.',
      error: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    if (isDbConnected()) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      const token = generateToken(user);
      return res.status(200).json({
        success: true,
        message: 'Logged in successfully.',
        token,
        user
      });
    } else {
      // In-Memory Mode
      const user = await MemoryStore.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash || '');
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      const token = generateToken(user);
      return res.status(200).json({
        success: true,
        message: 'Logged in successfully.',
        token,
        user
      });
    }
  } catch (error) {
    console.error('[AuthController Login Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed.',
      error: error.message
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    if (isDbConnected()) {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found.'
        });
      }
      return res.status(200).json({ success: true, user });
    } else {
      const user = await MemoryStore.findUserById(req.user.userId);
      return res.status(200).json({
        success: true,
        user: user || {
          _id: req.user.userId,
          name: req.user.name,
          email: req.user.email,
          preferences: {}
        }
      });
    }
  } catch (error) {
    console.error('[AuthController GetProfile Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile.',
      error: error.message
    });
  }
};

export const updatePreferences = async (req, res) => {
  try {
    const { preferences } = req.body;
    if (!preferences) {
      return res.status(400).json({
        success: false,
        message: 'Preferences data is required.'
      });
    }

    if (isDbConnected()) {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found.'
        });
      }

      user.preferences = {
        ...user.preferences.toObject(),
        ...preferences
      };
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Accessibility preferences updated successfully.',
        preferences: user.preferences
      });
    } else {
      const updatedPrefs = await MemoryStore.updateUserPreferences(req.user.userId, preferences);
      return res.status(200).json({
        success: true,
        message: 'Accessibility preferences updated successfully.',
        preferences: updatedPrefs || preferences
      });
    }
  } catch (error) {
    console.error('[AuthController UpdatePreferences Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update preferences.',
      error: error.message
    });
  }
};

export const demoLogin = async (req, res) => {
  try {
    const demoEmail = 'demo@accessbridge.ai';

    if (isDbConnected()) {
      let user = await User.findOne({ email: demoEmail });
      if (!user) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('DemoAccess2026!', salt);
        user = new User({
          name: 'Alex Rivera (Demo Evaluator)',
          email: demoEmail,
          passwordHash,
          preferences: {
            contrast: 'high-contrast-dark',
            textSize: 'large',
            fontFamily: 'dyslexic',
            cognitiveSupport: 'maximum',
            preferredLanguage: 'en',
            lineSpacing: 'relaxed',
            autoTTS: false,
            speechRate: 1.0
          }
        });
        await user.save();
      }

      const token = generateToken(user);
      return res.status(200).json({
        success: true,
        message: 'Logged in as Demo Evaluator.',
        token,
        user
      });
    } else {
      // Immediate In-Memory Fallback - ZERO wait, ZERO buffer timeout!
      let user = await MemoryStore.findUserByEmail(demoEmail);
      if (!user) {
        user = await MemoryStore.saveUser({
          _id: 'demo-user-001',
          name: 'Alex Rivera (Demo Evaluator)',
          email: demoEmail,
          preferences: {
            contrast: 'high-contrast-dark',
            textSize: 'large',
            fontFamily: 'dyslexic',
            cognitiveSupport: 'maximum',
            preferredLanguage: 'en',
            lineSpacing: 'relaxed',
            autoTTS: false,
            speechRate: 1.0
          }
        });
      }

      const token = generateToken(user);
      return res.status(200).json({
        success: true,
        message: 'Logged in as Demo Evaluator (Resilient Mode).',
        token,
        user
      });
    }
  } catch (error) {
    console.error('[AuthController DemoLogin Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to start demo session.',
      error: error.message
    });
  }
};
