import mongoose from 'mongoose';

const transformationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      index: true
    },
    originalType: {
      type: String,
      enum: ['pdf', 'image', 'text'],
      required: true
    },
    originalFileName: {
      type: String,
      default: 'Pasted Text'
    },
    originalText: {
      type: String,
      default: ''
    },
    summary: {
      type: String,
      required: true
    },
    easyRead: {
      type: [String],
      default: []
    },
    keyInfo: {
      deadlines: {
        type: [String],
        default: []
      },
      locations: {
        type: [String],
        default: []
      },
      actions: {
        type: [String],
        default: []
      }
    },
    translation: {
      type: String,
      default: ''
    },
    targetLanguage: {
      type: String,
      default: 'en'
    },
    suggestedQuestions: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Transformation = mongoose.model('Transformation', transformationSchema);
export default Transformation;
