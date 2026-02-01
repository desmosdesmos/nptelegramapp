import { WheelPrize } from '../types/wheel';

// Конфигурация призов для колеса фортуны
export const wheelPrizes: WheelPrize[] = [
  // Обычные призы (60% шанс)
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
    id: 'discount-5',
    name: '5% скидка',
    type: 'discount',
    value: 5,
    rarity: 'common',
    description: '5% скидка на следующую услугу',
    icon: '🏷️'
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
    id: 'free-ozonation',
    name: 'Бесплатная озонация',
    type: 'free_service',
    value: 'ozonation',
    rarity: 'common',
    description: 'Бесплатная услуга озонации при следующем визите',
    icon: '💨'
  },

  // Редкие призы (30% шанс)
  {
    id: 'discount-10',
    name: '10% скидка',
    type: 'discount',
    value: 10,
    rarity: 'rare',
    description: '10% скидка на следующую услугу',
    icon: '🏷️'
  },
  {
    id: 'points-200',
    name: '200 баллов',
    type: 'points',
    value: 200,
    rarity: 'rare',
    description: 'Добавлено 200 баллов к вашему счету',
    icon: '⭐'
  },
  {
    id: 'free-ceiling',
    name: 'Бесплатный потолок',
    type: 'free_service',
    value: 'ceiling',
    rarity: 'rare',
    description: 'Бесплатная химчистка потолка при следующем визите',
    icon: '☁️'
  },
  {
    id: 'bonus-seat',
    name: 'Бесплатное сиденье',
    type: 'bonus_option',
    value: 'seat',
    rarity: 'rare',
    description: 'Бесплатная химчистка одного сиденья',
    icon: '🧽'
  },

  // Эпические призы (8% шанс)
  {
    id: 'discount-15',
    name: '15% скидка',
    type: 'discount',
    value: 15,
    rarity: 'epic',
    description: '15% скидка на следующую услугу',
    icon: '🏷️'
  },
  {
    id: 'points-500',
    name: '500 баллов',
    type: 'points',
    value: 500,
    rarity: 'epic',
    description: 'Добавлено 500 баллов к вашему счету',
    icon: '⭐'
  },
  {
    id: 'free-full-cleaning',
    name: '20% скидка на полную химчистку',
    type: 'discount',
    value: 20,
    rarity: 'epic',
    description: '20% скидка на полную химчистку салона',
    icon: '🚗'
  },

  // Легендарные призы (2% шанс)
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
  common: 60,    // 60% шанс
  rare: 30,      // 30% шанс
  epic: 8,       // 8% шанс
  legendary: 2   // 2% шанс
};