/**
 * Основной серверный файл для API
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - CORS должен быть первым
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
  origin: corsOrigin,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'ngrok-skip-browser-warning']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes - импортируем и используем роуты
const channelPostsRoute = require('./routes/channelPosts');
const referralsRoute = require('./routes/referrals');

app.use('/api', channelPostsRoute);
app.use('/api/referrals', referralsRoute);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Основной маршрут для тестирования
app.get('/', (req, res) => {
  res.json({ 
    message: 'NP Telegram API Server',
    endpoints: {
      health: '/health',
      channelPosts: '/api/channel-posts'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Запускаем сервер на всех интерфейсах
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API endpoint: http://localhost:${PORT}/api/channel-posts`);
  console.log(`External access: http://185.171.202.83:${PORT}/health`);
});