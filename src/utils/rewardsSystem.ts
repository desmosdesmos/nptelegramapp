// Система хранения и управления наградами
import { getUserRewardsFromServer, addPointsToServer, addPrizeToServer } from '../api/rewardsApi';

// Кэш для локального хранения данных до синхронизации
const REWARDS_CACHE_KEY = 'user_rewards_cache';

// Получить текущие награды пользователя (сначала из кэша, потом с сервера)
export const getUserRewards = async () => {
  // Сначала пробуем получить из кэша
  const cachedRewards = localStorage.getItem(REWARDS_CACHE_KEY);
  if (cachedRewards) {
    try {
      const parsed = JSON.parse(cachedRewards);
      // Проверяем, не устарел ли кэш (например, обновляем раз в 5 минут)
      const cacheTime = parsed.cacheTimestamp || 0;
      const fiveMinutes = 5 * 60 * 1000; // 5 минут в миллисекундах

      if (Date.now() - cacheTime < fiveMinutes) {
        return parsed.data;
      }
    } catch (e) {
      console.error('Error parsing cached rewards:', e);
    }
  }

  // Если кэш устарел или не существует, получаем с сервера
  try {
    const serverRewards = await getUserRewardsFromServer();

    // Сохраняем в кэш
    const cacheData = {
      data: serverRewards,
      cacheTimestamp: Date.now()
    };
    localStorage.setItem(REWARDS_CACHE_KEY, JSON.stringify(cacheData));

    return serverRewards;
  } catch (error) {
    console.error('Error getting user rewards from server:', error);

    // Возвращаем пустые награды в случае ошибки
    return {
      points: 0,
      prizes: [] // массив объектов { id, name, type, timestamp }
    };
  }
};

// Добавить бонусы (сохраняем на сервере и в кэше)
export const addPoints = async (points: number) => {
  try {
    const updated = await addPointsToServer(points);

    // Обновляем кэш
    const cacheData = {
      data: updated,
      cacheTimestamp: Date.now()
    };
    localStorage.setItem(REWARDS_CACHE_KEY, JSON.stringify(cacheData));

    return updated;
  } catch (error) {
    console.error('Error adding points:', error);

    // В случае ошибки обновляем только локально
    const current = await getUserRewards();
    const newPoints = current.points + points;

    const updatedLocal = {
      ...current,
      points: newPoints
    };

    // Обновляем кэш
    const cacheData = {
      data: updatedLocal,
      cacheTimestamp: Date.now()
    };
    localStorage.setItem(REWARDS_CACHE_KEY, JSON.stringify(cacheData));

    return updatedLocal;
  }
};

// Добавить приз (сохраняем на сервере и в кэше)
export const addPrize = async (prize: { id: string; name: string; type: string; description?: string }) => {
  try {
    const current = await getUserRewards();

    // Проверяем, нет ли уже этого приза (для уникальных призов)
    const existingPrizeIndex = current.prizes.findIndex((p: { id: string }) => p.id === prize.id);
    if (existingPrizeIndex !== -1) {
      // Если приз уже есть, не добавляем повторно (для уникальных призов)
      return current;
    }

    const updated = await addPrizeToServer(prize);

    // Обновляем кэш
    const cacheData = {
      data: updated,
      cacheTimestamp: Date.now()
    };
    localStorage.setItem(REWARDS_CACHE_KEY, JSON.stringify(cacheData));

    return updated;
  } catch (error) {
    console.error('Error adding prize:', error);

    // В случае ошибки обновляем только локально
    const current = await getUserRewards();

    // Проверяем, нет ли уже этого приза (для уникальных призов)
    const existingPrizeIndex = current.prizes.findIndex((p: { id: string }) => p.id === prize.id);
    if (existingPrizeIndex !== -1) {
      // Если приз уже есть, не добавляем повторно (для уникальных призов)
      return current;
    }

    const newPrize = {
      ...prize,
      timestamp: Date.now()
    };

    const updatedLocal = {
      ...current,
      prizes: [...current.prizes, newPrize]
    };

    // Обновляем кэш
    const cacheData = {
      data: updatedLocal,
      cacheTimestamp: Date.now()
    };
    localStorage.setItem(REWARDS_CACHE_KEY, JSON.stringify(cacheData));

    return updatedLocal;
  }
};

// Сбросить награды (для тестирования)
export const resetRewards = () => {
  localStorage.removeItem(REWARDS_CACHE_KEY);
};

// Получить только бонусы
export const getPoints = async () => {
  const rewards = await getUserRewards();
  return rewards.points;
};

// Получить список призов
export const getPrizes = async () => {
  const rewards = await getUserRewards();
  return rewards.prizes;
};