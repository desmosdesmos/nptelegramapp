import { WheelPrize } from '../types/wheel';

// Конфигурация призов для колеса фортуны
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
    id: 'points-20',
    name: '20 баллов',
    type: 'points',
    value: 20,
    rarity: 'common',
    description: 'Добавлено 20 баллов к вашему счету',
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
    id: 'points-100',
    name: '100 баллов',
    type: 'points',
    value: 100,
    rarity: 'common',
    description: 'Добавлено 100 баллов к вашему счету',
    icon: '⭐'
  },
  {
    id: 'points-200',
    name: '200 баллов',
    type: 'points',
    value: 200,
    rarity: 'common',
    description: 'Добавлено 200 баллов к вашему счету',
    icon: '⭐'
  },
  {
    id: 'points-500',
    name: '500 баллов',
    type: 'points',
    value: 500,
    rarity: 'rare',
    description: 'Добавлено 500 баллов к вашему счету',
    icon: '⭐'
  },
  {
    id: 'points-1000',
    name: '1000 баллов',
    type: 'points',
    value: 1000,
    rarity: 'epic',
    description: 'Добавлено 1000 баллов к вашему счету',
    icon: '⭐'
  },
  {
    id: 'points-2000',
    name: '2000 баллов',
    type: 'points',
    value: 2000,
    rarity: 'epic',
    description: 'Добавлено 2000 баллов к вашему счету',
    icon: '⭐'
  },
  {
    id: 'discount-1',
    name: '1% скидка',
    type: 'discount',
    value: 1,
    rarity: 'common',
    description: '1% скидка на следующую услугу',
    icon: '🏷️'
  },
  {
    id: 'discount-2',
    name: '2% скидка',
    type: 'discount',
    value: 2,
    rarity: 'common',
    description: '2% скидка на следующую услугу',
    icon: '🏷️'
  },
  {
    id: 'discount-3',
    name: '3% скидка',
    type: 'discount',
    value: 3,
    rarity: 'common',
    description: '3% скидка на следующую услугу',
    icon: '🏷️'
  },
  {
    id: 'discount-5',
    name: '5% скидка',
    type: 'discount',
    value: 5,
    rarity: 'common',
    description: '5% скидка на следующую услугу',
    icon: '🏷️'
  },
  {
    id: 'free-ozonation',
    name: 'Бесплатная озонация',
    type: 'free_service',
    value: 'ozonation',
    rarity: 'rare',
    description: 'Бесплатная услуга озонации при следующем визите',
    icon: '💨'
  },
  {
    id: 'free-vacuuming',
    name: 'Бесплатное обеспыливание',
    type: 'free_service',
    value: 'vacuuming',
    rarity: 'rare',
    description: 'Бесплатное обеспыливание салона при следующем визите',
    icon: '🧹'
  },
  {
    id: 'free-full-cleaning',
    name: 'Бесплатная полная химчистка',
    type: 'free_service',
    value: 'full_cleaning',
    rarity: 'epic',
    description: 'Бесплатная полная химчистка салона',
    icon: '🚗'
  }
];

// Вероятности выпадения конкретных призов
export const prizeProbabilities = {
  'points-10': 99.5,        // 99.5% шанс
  'points-20': 99,          // 99% шанс
  'points-50': 10,          // 10% шанс
  'points-500': 0.0001,     // 0.0001% шанс
  'free-ozonation': 2,      // 2% шанс
  'free-vacuuming': 0.5,    // 0.5% шанс
  'free-full-cleaning': 0,  // 0% шанс
  'points-2000': 0,         // 0% шанс
  'points-1000': 0          // 0% шанс
};