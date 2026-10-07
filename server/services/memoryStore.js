import mongoose from 'mongoose';

// In-Memory Storage when MongoDB Atlas is connecting or offline
const memoryUsers = new Map();
const memoryTransformations = new Map();
const memoryChats = new Map();

// Pre-populate default Demo Evaluator user in memory
const defaultDemoUser = {
  _id: 'demo-user-001',
  name: 'Alex Rivera (Demo Evaluator)',
  email: 'demo@accessbridge.ai',
  preferences: {
    contrast: 'high-contrast-dark',
    textSize: 'large',
    fontFamily: 'dyslexic',
    cognitiveSupport: 'maximum',
    preferredLanguage: 'en',
    lineSpacing: 'relaxed',
    autoTTS: false,
    speechRate: 1.0,
    speechPitch: 1.0,
    reducedMotion: false
  },
  createdAt: new Date()
};
memoryUsers.set('demo@accessbridge.ai', defaultDemoUser);

export const isDbConnected = () => mongoose.connection.readyState === 1;

export const MemoryStore = {
  // USER METHODS
  findUserByEmail: async (email) => {
    return memoryUsers.get(email.toLowerCase()) || null;
  },
  findUserById: async (id) => {
    for (const u of memoryUsers.values()) {
      if (u._id === id || String(u._id) === String(id)) return u;
    }
    return null;
  },
  saveUser: async (userData) => {
    const id = userData._id || `user-${Date.now()}`;
    const userObj = {
      _id: id,
      ...userData,
      createdAt: new Date()
    };
    memoryUsers.set(userObj.email.toLowerCase(), userObj);
    return userObj;
  },
  updateUserPreferences: async (userId, preferences) => {
    const user = await MemoryStore.findUserById(userId);
    if (user) {
      user.preferences = { ...user.preferences, ...preferences };
      return user.preferences;
    }
    return null;
  },

  // TRANSFORMATION METHODS
  saveTransformation: async (data) => {
    const id = `trans-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const record = {
      _id: id,
      ...data,
      createdAt: new Date()
    };
    memoryTransformations.set(id, record);
    return record;
  },
  findTransformationsByUser: async (userId) => {
    const list = [];
    for (const t of memoryTransformations.values()) {
      if (!userId || t.userId === userId || String(t.userId) === String(userId)) {
        list.push(t);
      }
    }
    return list.sort((a, b) => b.createdAt - a.createdAt);
  },
  findTransformationById: async (id) => {
    return memoryTransformations.get(id) || null;
  },
  deleteTransformation: async (id, userId) => {
    if (memoryTransformations.has(id)) {
      memoryTransformations.delete(id);
      return true;
    }
    return false;
  },

  // CHAT METHODS
  saveChatMessage: async (data) => {
    const id = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const msg = {
      _id: id,
      ...data,
      createdAt: new Date()
    };
    const transId = String(data.transformationId);
    if (!memoryChats.has(transId)) {
      memoryChats.set(transId, []);
    }
    memoryChats.get(transId).push(msg);
    return msg;
  },
  getChatHistory: async (transformationId) => {
    return memoryChats.get(String(transformationId)) || [];
  }
};
