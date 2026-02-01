import { WheelPrize } from '../types/wheel';

// Конфигурация призов для колеса фортуны
export const wheelPrizes: WheelPrize[] = [
  // Мелкие бонусы (99.99% шанс)
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
    id: 'points-30',
    name: '30 баллов',
    type: 'points',
    value: 30,
    rarity: 'common',
    description: 'Добавлено 30 баллов к вашему счету',
    icon: '⭐'
  },
  {
    id: 'points-40',
    name: '40 баллов',
    type: 'points',
    value: 40,
    rarity: 'common',
    description: 'Добавлено 40 баллов к вашему счету',
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
    id: 'discount-4',
    name: '4% скидка',
    type: 'discount',
    value: 4,
    rarity: 'common',
    description: '4% скидка на следующую услугу',
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

  // Средние призы (3% шанс)
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

  // Дорогие призы (0% шанс)
  {
    id: 'free-full-cleaning',
    name: 'Бесплатная полная химчистка',
    type: 'free_service',
    value: 'full_cleaning',
    rarity: 'epic',
    description: 'Бесплатная полная химчистка салона',
    icon: '🚗'
  },
  {
    id: 'free-ceiling',
    name: 'Бесплатный потолок',
    type: 'free_service',
    value: 'ceiling',
    rarity: 'epic',
    description: 'Бесплатная химчистка потолка при следующем визите',
    icon: '☁️'
  },
  {
    id: 'vip-service',
    name: 'VIP-услуга',
    type: 'free_service',
    value: 'vip',
    rarity: 'legendary',
    description: 'Полная VIP-химчистка автомобиля',
    icon: '👑'
  },
  {
    id: 'discount-30',
    name: '30% скидка',
    type: 'discount',
    value: 30,
    rarity: 'legendary',
    description: '30% скидка на любую услугу',
    icon: '🏷️'
  }
];

// Вероятности выпадения призов по редкости
export const rarityWeights = {
  common: 99.99,    // 99.99% шанс на мелкие бонусы
  rare: 3,          // 3% шанс на средние призы
  epic: 0,          // 0% шанс на дорогие призы
  legendary: 0      // 0% шанс на легендарные призы
};