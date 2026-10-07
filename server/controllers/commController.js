import { bridgeCommunication } from '../services/geminiService.js';

export const bridgeMessage = async (req, res) => {
  try {
    const { message, sourceLanguage = 'en', targetLanguage = 'en', mode = 'both' } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Spoken or written message cannot be empty.'
      });
    }

    const bridgeResult = await bridgeCommunication({
      message: message.trim(),
      sourceLanguage,
      targetLanguage,
      mode
    });

    return res.status(200).json({
      success: true,
      data: bridgeResult
    });
  } catch (error) {
    console.error('[CommController Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process communication bridge.',
      error: error.message
    });
  }
};
