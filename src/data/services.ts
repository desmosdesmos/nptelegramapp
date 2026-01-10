/**
 * Данные услуг и цен для NP Auto Detail
 * ТОЧНЫЙ прайс согласно требованиям
 */

import type { ServiceCategory } from '../types/services';

// Основные услуги
export const mainServices: ServiceCategory[] = [
  {
    id: 'full-cleaning',
    name: 'Полная химчистка',
    services: [
      {
        id: 'full-cleaning-basic',
        name: 'Полная химчистка салона',
        price: 6999,
        description: 'включает в себя: \n- химчистка всех сидений; \n- химчистка ковролина; \n- химчистка багажника; \n- химчистка торпедо, центральной консоли, порогов и всего пластика; \n- химчистка багажника',
        icon: '🧹',
        additionalOptions: [
          {
            id: 'ceiling',
            name: 'Потолок',
            price: 999,
            icon: '☁️',
          },
          {
            id: 'ozonation',
            name: 'Озонация',
            price: 999,
            icon: '🌫️',
            description: 'Устраняет стойкие запахи (сигареты, животные, сырость, еда), уничтожает бактерии и грибок',
          },
        ],
      },
    ],
  },
  {
    id: 'pre-sale',
    name: 'Предпродажная подготовка',
    services: [
      {
        id: 'pre-sale-prep',
        name: 'Предпродажная подготовка',
        price: 4899,
        icon: '🚗',
        description: 'включает в себя: \n- химчистка всех сидений, \n- обеспыливание и пылесос ковролина без химии; \n- химчистка торпедо, центральной консоли, порогов и всего пластика; \n- химчистка багажника.',
        additionalOptions: [
          {
            id: 'ozonation-pre-sale',
            name: 'Озонация',
            price: 999,
            icon: '🌫️',
            description: 'Устраняет стойкие запахи (сигареты, животные, сырость, еда), уничтожает бактерии и грибок',
          },
          {
            id: 'carpeting-pre-sale',
            name: 'Ковролин',
            price: 2999,
            icon: '🦶',
          },
          {
            id: 'ceiling-pre-sale',
            name: 'Потолок',
            price: 1999,
            icon: '☁️',
          },
        ],
      },
    ],
  },
];

// Услуги по зонам
export const localCleaningServices: ServiceCategory[] = [
  {
    id: 'partial-cleaning',
    name: 'Химчистка отдельных зон',
    services: [
      {
        id: 'seat',
        name: 'Сиденье (цена за шт.)',
        price: 1000,
        icon: '🧽',
      },
      {
        id: 'ceiling-only',
        name: 'Потолок',
        price: 3000,
        icon: '☁️',
      },
      {
        id: 'floor',
        name: 'Пол + ковролин',
        price: 3000,
        icon: '🦶',
      },
      {
        id: 'trunk',
        name: 'Багажник',
        price: 1000,
        icon: '🎒',
      },
      {
        id: 'door-cards',
        name: 'Дверная карта (цена за шт.)',
        price: 400,
        icon: '🚪',
      },
      {
        id: 'ozonation-local',
        name: 'Озонация',
        price: 999,
        icon: '🌫️',
        description: 'Устраняет стойкие запахи (сигареты, животные, сырость, еда), уничтожает бактерии и грибок',
      },
    ],
  },
];

// Все категории услуг
export const services: ServiceCategory[] = [...mainServices, ...localCleaningServices];

/**
 * Получить все услуги в плоском виде
 */
export const getAllServices = () => {
  return services.flatMap(category => category.services);
};

/**
 * Получить услугу по ID
 */
export const getServiceById = (id: string) => {
  return getAllServices().find(service => service.id === id);
};

/**
 * Получить опцию услуги по ID
 */
export const getServiceOptionById = (serviceId: string, optionId: string) => {
  const service = getServiceById(serviceId);
  return service?.additionalOptions?.find(option => option.id === optionId);
};
