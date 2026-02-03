import { getTelegramUser } from '../utils/telegram';

// Базовый URL для API
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.nptelegramapp.com'  // Для продакшена
  : 'http://localhost:3001';         // Для разработки

/**
 * Отправить результат прокрута колеса в Telegram администратору
 */
export const sendWheelSpinResultToTelegram = async (result: any) => {
  const user = getTelegramUser();
  if (!user) {
    console.error('Cannot send wheel spin result: Telegram user not found');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/wheel-spin-result`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        userName: user.username ? `@${user.username}` : `${user.first_name} ${user.last_name || ''}`.trim(),
        result: result
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Wheel spin result sent to admin:', data);
  } catch (error) {
    console.error('Error sending wheel spin result to admin:', error);
  }
};