import { WheelPrize } from '../types/wheel';

// Конфигурация призов для колеса фортуны (упрощенная версия с 5 ключевыми призами)
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
  },
  {
    id: 'free-full-cleaning',
    name: 'Комплекс',
    type: 'free_service',
    value: 'full_cleaning',
    rarity: 'epic',
    description: 'Бесплатная полная химчистка салона',
    icon: ''
  },
  {
    id: 'free-pre-sale',
    name: 'Предпродажная подготовка',
    type: 'free_service',
    value: 'pre_sale',
    rarity: 'epic',
    description: 'Бесплатная предпродажная подготовка автомобиля',
    icon: ''
  }
];

// Вероятности выпадения конкретных призов (для 5 секторов)
export const prizeProbabilities = {
  'points-10': 50,          // 50% шанс - самый частый приз
  'free-ozonation': 20,     // 20% шанс - редкий приз
  'points-1000': 10,        // 10% шанс - легендарный приз
  'free-full-cleaning': 15, // 15% шанс - эпический приз
  'free-pre-sale': 5        // 5% шанс - редкий приз
};