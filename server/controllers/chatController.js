import Chat from '../models/Chat.js';
import Transformation from '../models/Transformation.js';
import { answerDocumentQuestion } from '../services/geminiService.js';
import { isDbConnected, MemoryStore } from '../services/memoryStore.js';

export const askDocumentQuestion = async (req, res) => {
  try {
    const { transformationId } = req.params;
    const { question, cognitiveSupport = 'simplified' } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Question cannot be empty.'
      });
    }

    let transformation = null;
    let history = [];

    if (isDbConnected()) {
      transformation = await Transformation.findById(transformationId);
      if (transformation) {
        history = await Chat.find({ transformationId }).sort({ createdAt: 1 }).limit(20);
      }
    } else {
      transformation = await MemoryStore.findTransformationById(transformationId);
      history = await MemoryStore.getChatHistory(transformationId);
    }

    if (!transformation) {
      return res.status(404).json({
        success: false,
        message: 'Associated transformation document not found.'
      });
    }

    const documentContext = `Document Summary: ${transformation.summary}\n\nEasy Read Points:\n${(transformation.easyRead || []).join('\n')}\n\nKey Deadlines: ${transformation.keyInfo?.deadlines?.join(', ') || 'None'}\nKey Actions: ${transformation.keyInfo?.actions?.join(', ') || 'None'}\nLocations: ${transformation.keyInfo?.locations?.join(', ') || 'None'}\n\nOriginal Text / Excerpt:\n${transformation.originalText || ''}`;

    // Call Gemini Q&A
    const answer = await answerDocumentQuestion({
      documentContext,
      chatHistory: history,
      question: question.trim(),
      cognitiveSupport
    });

    let userMessage = { role: 'user', content: question.trim() };
    let modelMessage = { role: 'model', content: answer };

    if (isDbConnected()) {
      userMessage = new Chat({ transformationId, role: 'user', content: question.trim() });
      await userMessage.save();
      modelMessage = new Chat({ transformationId, role: 'model', content: answer });
      await modelMessage.save();
    } else {
      userMessage = await MemoryStore.saveChatMessage({ transformationId, role: 'user', content: question.trim() });
      modelMessage = await MemoryStore.saveChatMessage({ transformationId, role: 'model', content: answer });
    }

    return res.status(200).json({
      success: true,
      userMessage,
      modelMessage,
      answer
    });
  } catch (error) {
    console.error('[ChatController Ask Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process question.',
      error: error.message
    });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const { transformationId } = req.params;

    if (isDbConnected()) {
      const messages = await Chat.find({ transformationId }).sort({ createdAt: 1 });
      return res.status(200).json({ success: true, messages });
    } else {
      const messages = await MemoryStore.getChatHistory(transformationId);
      return res.status(200).json({ success: true, messages });
    }
  } catch (error) {
    console.error('[ChatController GetHistory Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve chat history.',
      error: error.message
    });
  }
};
