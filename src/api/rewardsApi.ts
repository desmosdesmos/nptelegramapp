import { getTelegramWebApp } from '../utils/telegram';

// Базовый URL для API
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.nptelegramapp.com'  // Для продакшена
  : 'http://localhost:3001';         // Для разработки

interface RewardData {
  points: number;
  prizes: Array<{
    id: string;
    name: string;
    type: string;
    description?: string;
    timestamp: number;
  }>;
  lastSpinTime?: number; // Время последнего вращения колеса
  dailyStreak?: number; // Текущая серия дней подряд
  lastSpinDate?: string; // Дата последнего вращения (для подсчета серии)
}

/**
 * Получить награды пользователя по Telegram ID
 */
export const getUserRewardsFromServer = async (): Promise<RewardData> => {
  const tg = getTelegramWebApp();
  if (!tg || !tg.initDataUnsafe.user) {
    throw new Error('Telegram user not found');
  }

  const userId = tg.initDataUnsafe.user.id;
  const token = tg.initDataUnsafe.hash;

  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/rewards`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Используем hash как токен аутентификации
      },
    });

    if (!response.ok) {
      // Если пользователя нет на сервере, возвращаем пустые награды
      if (response.status === 404) {
        return {
          points: 0,
          prizes: []
        };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user rewards:', error);
    // В случае ошибки возвращаем пустые награды
    return {
      points: 0,
      prizes: []
    };
  }
};

/**
 * Сохранить награды пользователя на сервере
 */
export const saveUserRewardsToServer = async (rewards: RewardData): Promise<void> => {
  const tg = getTelegramWebApp();
  if (!tg || !tg.initDataUnsafe.user) {
    throw new Error('Telegram user not found');
  }

  const userId = tg.initDataUnsafe.user.id;
  const token = tg.initDataUnsafe.hash;

  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/rewards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(rewards),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error saving user rewards:', error);
    throw error;
  }
};

/**
 * Добавить очки пользователю на сервере
 * @deprecated Используйте saveUserRewardsToServer напрямую для обновления всех данных
 */
export const addPointsToServer = async (points: number): Promise<RewardData> => {
  const currentRewards = await getUserRewardsFromServer();
  const newPoints = currentRewards.points + points;

  const updatedRewards = {
    ...currentRewards,
    points: newPoints
  };

  await saveUserRewardsToServer(updatedRewards);
  return updatedRewards;
};

/**
 * Обновить время последнего вращения колеса
 */
export const updateLastSpinTime = async (): Promise<RewardData> => {
  const currentRewards = await getUserRewardsFromServer();
  const now = Date.now();
  
  const updatedRewards = {
    ...currentRewards,
    lastSpinTime: now
  };

  await saveUserRewardsToServer(updatedRewards);
  return updatedRewards;
};

/**
 * Добавить приз пользователю на сервере
 * @deprecated Используйте saveUserRewardsToServer напрямую для обновления всех данных
 */
export const addPrizeToServer = async (prize: { id: string; name: string; type: string; description?: string }): Promise<RewardData> => {
  const currentRewards = await getUserRewardsFromServer();

  // Проверяем, нет ли уже этого приза (для уникальных призов)
  const existingPrizeIndex = currentRewards.prizes.findIndex(p => p.id === prize.id);
  if (existingPrizeIndex !== -1) {
    // Если приз уже есть, не добавляем повторно (для уникальных призов)
    return currentRewards;
  }

  const newPrize = {
    ...prize,
    timestamp: Date.now()
  };

  const updatedRewards = {
    ...currentRewards,
    prizes: [...currentRewards.prizes, newPrize]
  };

  await saveUserRewardsToServer(updatedRewards);
  return updatedRewards;
};