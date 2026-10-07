import Transformation from '../models/Transformation.js';
import { transformContentWithGemini } from '../services/geminiService.js';
import { isDbConnected, MemoryStore } from '../services/memoryStore.js';
import pdfParse from 'pdf-parse';

export const createTransformation = async (req, res) => {
  try {
    const file = req.file;
    const { text, targetLanguage = 'en', cognitiveSupport = 'simplified' } = req.body;

    if (!file && (!text || text.trim() === '')) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file (PDF, Image, Text) or provide text content.'
      });
    }

    let originalType = 'text';
    let originalFileName = 'Pasted Text';
    let fileBuffer = null;
    let mimeType = 'text/plain';
    let extractedText = text || '';

    if (file) {
      fileBuffer = file.buffer;
      mimeType = file.mimetype;
      originalFileName = file.originalname;

      if (mimeType.includes('pdf') || originalFileName.endsWith('.pdf')) {
        originalType = 'pdf';
        try {
          const parsed = await pdfParse(fileBuffer);
          extractedText = parsed.text || '';
        } catch (pdfErr) {
          console.warn('[TransformController] PDF text parse note:', pdfErr.message);
          extractedText = 'PDF document content (parsed by multimodal vision).';
        }
      } else if (mimeType.startsWith('image/')) {
        originalType = 'image';
        extractedText = 'Image content (visual analysis by Gemini).';
      } else {
        originalType = 'text';
        extractedText = fileBuffer.toString('utf-8');
      }
    }

    // Call Gemini 1.5 Flash Service
    const aiResult = await transformContentWithGemini({
      fileBuffer,
      mimeType,
      textContent: extractedText,
      targetLanguage,
      cognitiveSupport
    });

    let userId = req.user ? req.user.userId : null;

    const docData = {
      userId,
      originalType,
      originalFileName,
      originalText: extractedText.slice(0, 50000),
      summary: aiResult.summary,
      easyRead: aiResult.easyRead,
      keyInfo: aiResult.keyInformation,
      translation: aiResult.translation,
      targetLanguage,
      suggestedQuestions: aiResult.suggestedQuestions
    };

    if (isDbConnected()) {
      const transformation = new Transformation(docData);
      await transformation.save();
      return res.status(201).json({
        success: true,
        message: 'Document transformed successfully.',
        transformation
      });
    } else {
      // In-Memory Mode
      const transformation = await MemoryStore.saveTransformation(docData);
      return res.status(201).json({
        success: true,
        message: 'Document transformed successfully (Resilient Mode).',
        transformation
      });
    }
  } catch (error) {
    console.error('[TransformController Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to transform document.',
      error: error.message
    });
  }
};

export const getTransformations = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (isDbConnected()) {
      const transformations = await Transformation.find({ userId })
        .sort({ createdAt: -1 })
        .limit(50);
      return res.status(200).json({ success: true, transformations });
    } else {
      const transformations = await MemoryStore.findTransformationsByUser(userId);
      return res.status(200).json({ success: true, transformations });
    }
  } catch (error) {
    console.error('[TransformController GetTransformations Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve transformation history.',
      error: error.message
    });
  }
};

export const getTransformationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const transformation = await Transformation.findById(id);
      if (!transformation) {
        return res.status(404).json({ success: false, message: 'Transformation record not found.' });
      }
      return res.status(200).json({ success: true, transformation });
    } else {
      const transformation = await MemoryStore.findTransformationById(id);
      if (!transformation) {
        return res.status(404).json({ success: false, message: 'Transformation record not found.' });
      }
      return res.status(200).json({ success: true, transformation });
    }
  } catch (error) {
    console.error('[TransformController GetById Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve transformation record.',
      error: error.message
    });
  }
};

export const deleteTransformation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    if (isDbConnected()) {
      const transformation = await Transformation.findOneAndDelete({ _id: id, userId });
      if (!transformation) {
        return res.status(404).json({ success: false, message: 'Transformation record not found or unauthorized.' });
      }
      return res.status(200).json({ success: true, message: 'Transformation deleted successfully.' });
    } else {
      const success = await MemoryStore.deleteTransformation(id, userId);
      return res.status(200).json({ success: true, message: 'Transformation deleted successfully.' });
    }
  } catch (error) {
    console.error('[TransformController Delete Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete transformation record.',
      error: error.message
    });
  }
};
