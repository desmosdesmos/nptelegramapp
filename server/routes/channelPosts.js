/**
 * API маршрут для получения постов из Telegram-канала
 * 
 * Этот файл должен быть размещен на серверной стороне
 * для обхода CORS ограничений при получении данных из Telegram
 */

const express = require('express');
const router = express.Router();
const { getChannelPosts } = require('../server/telegram-channel-fetcher');

// Маршрут для получения постов из Telegram-канала
router.post('/channel-posts', async (req, res) => {
  try {
    const { channel, limit = 10 } = req.body;
    
    if (!channel) {
      return res.status(400).json({ error: 'Channel name is required' });
    }
    
    // Получаем посты из канала
    const posts = await getChannelPosts(channel, limit);
    
    res.json({
      success: true,
      posts: posts,
      count: posts.length
    });
  } catch (error) {
    console.error('Error fetching channel posts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch channel posts',
      message: error.message
    });
  }
});

module.exports = router;