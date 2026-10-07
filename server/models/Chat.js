import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    transformationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transformation',
      required: true,
      index: true
    },
    role: {
      type: String,
      enum: ['user', 'model'],
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
