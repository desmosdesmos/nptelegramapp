// Система хранения и управления наградами

const REWARDS_KEY = 'user_rewards';

// Получить текущие награды пользователя
export const getUserRewards = () => {
  const rewards = localStorage.getItem(REWARDS_KEY);
  return rewards ? JSON.parse(rewards) : {
    points: 0,
    prizes: [] // массив объектов { id, name, type, timestamp }
  };
};

// Добавить бонусы
export const addPoints = (points: number) => {
  const current = getUserRewards();
  const newPoints = current.points + points;
  
  const updated = {
    ...current,
    points: newPoints
  };
  
  localStorage.setItem(REWARDS_KEY, JSON.stringify(updated));
  return updated;
};

// Добавить приз
export const addPrize = (prize: { id: string; name: string; type: string; description?: string }) => {
  const current = getUserRewards();
  
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
  
  const updated = {
    ...current,
    prizes: [...current.prizes, newPrize]
  };
  
  localStorage.setItem(REWARDS_KEY, JSON.stringify(updated));
  return updated;
};

// Сбросить награды (для тестирования)
export const resetRewards = () => {
  localStorage.removeItem(REWARDS_KEY);
};

// Получить только бонусы
export const getPoints = () => {
  return getUserRewards().points;
};

// Получить список призов
export const getPrizes = () => {
  return getUserRewards().prizes;
};