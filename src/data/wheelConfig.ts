import { WheelPrize } from '../types/wheel';

// Конфигурация призов для колеса фортуны (упрощенная версия с 4 ключевыми призами)
export const wheelPrizes: WheelPrize[] = [
  // Призы с конкретными шансами
  {
    id: 'points-10',
    name: '10 бонусов',
    type: 'points',
    value: 10,
    rarity: 'common',
    description: 'Добавлено 10 бонусов к вашему счету',
    icon: ''
  },
  {
    id: 'points-50',
    name: '50 бонусов',
    type: 'points',
    value: 50,
    rarity: 'common',
    description: 'Добавлено 50 бонусов к вашему счету',
    icon: ''
  },
  {
    id: 'free-ozonation',
    name: 'Озонация',
    type: 'free_service',
    value: 'ozonation',
    rarity: 'rare',
    description: 'Бесплатная услуга озонации при следующем визите',
    icon: ''
  },
  {
    id: 'points-1000',
    name: '1000 бонусов',
    type: 'points',
    value: 1000,
    rarity: 'legendary',
    description: 'Добавлено 1000 бонусов к вашему счету',
    icon: ''
  }
];

// Вероятности выпадения конкретных призов (для 4 секторов)
export const prizeProbabilities = {
  'points-10': 60,          // 60% шанс - самый частый приз
  'points-50': 25,          // 25% шанс - средний приз
  'free-ozonation': 10,     // 10% шанс - редкий приз
  'points-1000': 5          // 5% шанс - легендарный приз
};