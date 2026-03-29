/**
 * API для отправки уведомлений в Telegram
 */

const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * Отправить уведомление о заходе пользователя в бота
 * POST /api/notify/user-visit
 */
router.post('/user-visit', async (req, res) => {
  try {
    const { userId, username, firstName, lastName, languageCode, isPremium, timestamp } = req.body;

    // Проверяем наличие переменных окружения
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const adminId = process.env.TELEGRAM_ADMIN_ID;

    if (!botToken || !adminId) {
      console.error('Telegram bot credentials not configured');
      return res.status(500).json({ error: 'Telegram bot not configured' });
    }

    // Формируем сообщение
    const message = `
🔔 <b>Новый пользователь зашел в бота!</b>

👤 <b>Информация о пользователе:</b>
• ID: <code>${userId}</code>
• Имя: ${firstName} ${lastName || ''}
• Username: ${username ? '@' + username : 'нет'}
• Язык: ${languageCode || 'не указан'}
• Premium: ${isPremium ? '✅ Да' : '❌ Нет'}

🕒 <b>Время захода:</b>
${new Date(timestamp).toLocaleString('ru-RU', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'Europe/Moscow'
    })} (МСК)
`.trim();

    // Отправляем сообщение через Telegram Bot API
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    await axios.post(telegramApiUrl, {
      chat_id: adminId,
      text: message,
      parse_mode: 'HTML'
    });

    console.log(`Notification sent to admin ${adminId} about user ${userId}`);
    res.json({ success: true, message: 'Notification sent' });
  } catch (error) {
    console.error('Error sending Telegram notification:', error.message);
    // Возвращаем успех, чтобы не ломать работу приложения при ошибке уведомления
    res.status(200).json({ success: false, error: 'Failed to send notification', details: error.message });
  }
});

/**
 * Отправить уведомление о действии пользователя
 * POST /api/notify/action
 */
router.post('/action', async (req, res) => {
  try {
    const { userId, username, firstName, action, details, timestamp } = req.body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const adminId = process.env.TELEGRAM_ADMIN_ID;

    if (!botToken || !adminId) {
      return res.status(500).json({ error: 'Telegram bot not configured' });
    }

    const message = `
⚡ <b>Действие пользователя</b>

👤 <b>Пользователь:</b>
• ID: <code>${userId}</code>
• Имя: ${firstName}
• Username: ${username ? '@' + username : 'нет'}

📋 <b>Действие:</b> ${action}
${details ? `ℹ️ <b>Детали:</b>\n${details}` : ''}

🕒 <b>Время:</b>
${new Date(timestamp).toLocaleString('ru-RU', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'Europe/Moscow'
    })} (МСК)
`.trim();

    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    await axios.post(telegramApiUrl, {
      chat_id: adminId,
      text: message,
      parse_mode: 'HTML'
    });

    console.log(`Action notification sent: ${action} by user ${userId}`);
    res.json({ success: true, message: 'Notification sent' });
  } catch (error) {
    console.error('Error sending action notification:', error.message);
    res.status(200).json({ success: false, error: 'Failed to send notification', details: error.message });
  }
});

module.exports = router;
