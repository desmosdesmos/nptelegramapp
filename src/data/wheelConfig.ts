import { WheelPrize } from '../types/wheel';

// Конфигурация призов для колеса фортуны (упрощенная версия с 6 призами)
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
    id: 'points-100',
    name: '100 бонусов',
    type: 'points',
    value: 100,
    rarity: 'common',
    description: 'Добавлено 100 бонусов к вашему счету',
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
    name: 'Предпродажка',
    type: 'free_service',
    value: 'pre_sale',
    rarity: 'epic',
    description: 'Бесплатная предпродажная подготовка автомобиля',
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

// Вероятности выпадения конкретных призов (для 6 секторов)
export const prizeProbabilities = {
  'points-10': 99,          // 99% шанс - самый частый приз
  'points-100': 3,          // 3% шанс - редкий приз
  'free-ozonation': 3,      // 3% шанс - редкий приз
  'free-full-cleaning': 0,  // 0% шанс - не выпадает
  'free-pre-sale': 0,       // 0% шанс - не выпадает
  'points-1000': 0          // 0% шанс - не выпадает
};