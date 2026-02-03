require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Простая "база данных" в памяти (в реальном приложении используйте MongoDB, PostgreSQL и т.д.)
const userRewardsDB = new Map();

// Telegram Bot Token (замените на ваш реальный токен)
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN_HERE';

/**
 * Проверка подлинности данных Telegram
 * @param {string} receivedHash - Хэш из initData
 * @param {string} queryString - queryString из initData
 * @returns {boolean} - Валиден ли хэш
 */
function validateTelegramAuth(receivedHash, queryString) {
  try {
    // Убираем hash из строки запроса
    const params = new URLSearchParams(queryString);
    const hash = params.get('hash');
    params.delete('hash');

    // Сортируем параметры по алфавиту
    const sortedParams = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Создаем секретный ключ из токена бота
    const secretKey = crypto.createHmac('sha256', Buffer.from('WebAppData', 'utf-8')).update(TELEGRAM_BOT_TOKEN).digest();

    // Создаем хэш строки данных
    const calculatedHash = crypto.createHmac('sha256', secretKey).update(sortedParams).digest('hex');

    return calculatedHash === receivedHash;
  } catch (error) {
    console.error('Error validating Telegram auth:', error);
    return false;
  }
}

// Middleware для аутентификации
function authenticateTelegramRequest(req, res, next) {
  const authHeader = req.headers.authorization;

  // Извлекаем хэш из заголовка Authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or invalid' });
  }

  const receivedHash = authHeader.substring(7); // Убираем 'Bearer ' префикс
  const userId = req.params.userId;

  // Для проверки аутентификации в реальном приложении вам нужно будет получить
  // initData из другого источника, например, из заголовка или тела запроса
  // Пока что мы пропускаем проверку, но в реальном приложении нужно будет
  // реализовать получение initData и проверку хэша

  // В целях демонстрации, пропускаем проверку аутентификации
  // В реальном приложении раскомментируйте следующие строки:
  /*
  const queryString = `user=${encodeURIComponent(JSON.stringify({id: userId}))}&hash=${receivedHash}`;
  if (!validateTelegramAuth(receivedHash, queryString)) {
    return res.status(401).json({ error: 'Invalid Telegram auth data' });
  }
  */

  next();
}

// Маршрут для получения наград пользователя
app.get('/users/:userId/rewards', authenticateTelegramRequest, (req, res) => {
  const userId = req.params.userId;

  console.log(`Getting rewards for user: ${userId}`);

  const userRewards = userRewardsDB.get(userId);

  if (!userRewards) {
    // Если пользователя нет в базе, возвращаем пустые награды
    return res.status(200).json({
      points: 0,
      prizes: []
    });
  }

  res.json(userRewards);
});

// Маршрут для сохранения наград пользователя
app.post('/users/:userId/rewards', authenticateTelegramRequest, (req, res) => {
  const userId = req.params.userId;
  const { points, prizes } = req.body;

  console.log(`Saving rewards for user: ${userId}`, { points, prizes });

  // Валидируем входные данные
  if (typeof points !== 'number' || !Array.isArray(prizes)) {
    return res.status(400).json({ error: 'Invalid data format' });
  }

  // Дополнительная валидация призов
  for (const prize of prizes) {
    if (!prize.id || !prize.name || !prize.type) {
      return res.status(400).json({ error: 'Each prize must have id, name, and type' });
    }
  }

  // Сохраняем награды пользователя
  const userData = {
    points,
    prizes
  };

  userRewardsDB.set(userId, userData);

  res.json(userData);
});

// Маршрут для проверки состояния сервера
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Маршрут для отправки уведомлений в Telegram
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID || 'YOUR_CHAT_ID_HERE'; // ID администратора (@yanvtg)

async function sendTelegramNotification(message) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });

    const result = await response.json();
    if (!result.ok) {
      console.error('Error sending Telegram notification:', result);
    }
    return result;
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    return null;
  }
}

// Маршрут для получения результатов прокрута колеса
app.post('/wheel-spin-result', async (req, res) => {
  const { userId, userName, result } = req.body;

  if (!userId || !userName || !result) {
    return res.status(400).json({ error: 'Missing required fields: userId, userName, result' });
  }

  // Формируем сообщение для администратора
  const message = `
🎰 <b>Новый результат прокрута колеса</b>

👤 Пользователь: ${userName} (ID: ${userId})
🎁 Приз: ${result.prize.name}
📝 Тип приза: ${result.prize.type}
💰 Значение: ${result.prize.value || 'N/A'}
📅 Время: ${new Date(result.timestamp).toLocaleString('ru-RU')}

#колесофортуны #результат
  `.trim();

  // Отправляем уведомление в Telegram
  const notificationResult = await sendTelegramNotification(message);

  // Логгируем результат в консоль
  console.log(`Wheel spin result from user ${userId} (${userName}):`, result);

  res.json({ success: true, notificationSent: !!notificationResult });
});

// Обработка 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Wheel spin notifications endpoint: http://localhost:${PORT}/wheel-spin-result`);
});