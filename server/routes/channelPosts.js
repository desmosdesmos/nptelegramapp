/**
 * API маршрут для получения постов из Telegram-канала
 */

const express = require('express');
const router = express.Router();
const { getChannelPosts } = require('../telegram-channel-fetcher');

// Маршрут для получения постов из Telegram-канала
router.post('/channel-posts', async (req, res) => {
  try {
    console.log('Received request for channel-posts:', req.body);
    
    const { channel = 'npdetailing', limit = 10 } = req.body;
    
    if (!channel) {
      return res.status(400).json({ error: 'Channel name is required' });
    }
    
    // Получаем посты из канала
    console.log(`Fetching ${limit} posts from channel: ${channel}`);
    const posts = await getChannelPosts(channel, limit);
    console.log(`Successfully fetched ${posts.length} posts`);
    
    res.json({
      success: true,
      posts: posts,
      count: posts.length
    });
  } catch (error) {
    console.error('Error fetching channel posts:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch channel posts',
      message: error.message
    });
  }
});

// GET endpoint для теста
router.get('/channel-posts', (req, res) => {
  res.json({ message: 'Use POST method with channel name' });
});

module.exports = router;