import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const preferenceSchema = new mongoose.Schema(
  {
    contrast: {
      type: String,
      enum: ['standard', 'high-contrast-dark', 'high-contrast-light', 'soft-warm'],
      default: 'standard'
    },
    textSize: {
      type: String,
      enum: ['small', 'medium', 'large', 'xlarge'],
      default: 'medium'
    },
    fontFamily: {
      type: String,
      enum: ['system', 'dyslexic', 'sans', 'serif'],
      default: 'system'
    },
    cognitiveSupport: {
      type: String,
      enum: ['standard', 'simplified', 'maximum'],
      default: 'simplified'
    },
    preferredLanguage: {
      type: String,
      default: 'en'
    },
    lineSpacing: {
      type: String,
      enum: ['normal', 'relaxed', 'loose'],
      default: 'normal'
    },
    reducedMotion: {
      type: Boolean,
      default: false
    },
    autoTTS: {
      type: Boolean,
      default: false
    },
    speechRate: {
      type: Number,
      default: 1.0,
      min: 0.5,
      max: 2.0
    },
    speechPitch: {
      type: Number,
      default: 1.0,
      min: 0.5,
      max: 1.5
    }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required']
    },
    preferences: {
      type: preferenceSchema,
      default: () => ({})
    }
  },
  {
    timestamps: true
  }
);

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
