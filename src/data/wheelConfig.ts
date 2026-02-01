import { WheelPrize } from '../types/wheel';

// Конфигурация призов для колеса фортуны (упрощенная версия с 5 ключевыми призами)
export const wheelPrizes: WheelPrize[] = [
  // Призы с конкретными шансами
  {
    id: 'points-10',
    name: '10 баллов',
    type: 'points',
    value: 10,
    rarity: 'common',
    description: 'Добавлено 10 баллов к вашему счету',
    icon: '⭐'
  },
  {
    id: 'points-50',
    name: '50 баллов',
    type: 'points',
    value: 50,
    rarity: 'common',
    description: 'Добавлено 50 баллов к вашему счету',
    icon: '⭐'
  },
  {
    id: 'free-full-cleaning',
    name: 'Комплекс',
    type: 'free_service',
    value: 'full_cleaning',
    rarity: 'epic',
    description: 'Бесплатная полная химчистка салона',
    icon: '🚗'
  },
  {
    id: 'free-ozonation',
    name: 'Озонация',
    type: 'free_service',
    value: 'ozonation',
    rarity: 'rare',
    description: 'Бесплатная услуга озонации при следующем визите',
    icon: '💨'
  },
  {
    id: 'points-1000',
    name: '1000 баллов',
    type: 'points',
    value: 1000,
    rarity: 'legendary',
    description: 'Добавлено 1000 баллов к вашему счету',
    icon: '🌟'
  }
];

// Вероятности выпадения конкретных призов (для 5 секторов)
export const prizeProbabilities = {
  'points-10': 70,          // 70% шанс - самый частый приз
  'points-50': 20,          // 20% шанс - средний приз
  'free-ozonation': 5,      // 5% шанс - редкий приз
  'free-full-cleaning': 3,  // 3% шанс - эпический приз
  'points-1000': 2          // 2% шанс - легендарный приз
};