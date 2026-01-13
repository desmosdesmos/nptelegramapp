/**
 * Данные примеров работ (до/после)
 */

export interface WorkExample {
  id: string;
  carBrand: string;
  carModel?: string;
  problem: string;
  beforeImage: string;
  afterImage: string;
  photos: string[];
}

// Примеры работ (в реальном приложении загружаются с сервера)
export const works: WorkExample[] = [
  {
    id: '1',
    carBrand: 'BMW',
    carModel: 'X5',
    problem: 'Шерсть животных, запах',
    beforeImage: 'https://via.placeholder.com/400x300/1A1A1A/FFFFFF?text=До',
    afterImage: 'https://via.placeholder.com/400x300/2A2A2A/FFFFFF?text=После',
    photos: [
      'https://via.placeholder.com/400x300/1A1A1A/FFFFFF?text=Фото+1',
      'https://via.placeholder.com/400x300/2A2A2A/FFFFFF?text=Фото+2',
      'https://via.placeholder.com/400x300/3A3A3A/FFFFFF?text=Фото+3',
    ],
  },
  {
    id: '2',
    carBrand: 'Mercedes-Benz',
    carModel: 'E-Class',
    problem: 'Соль, грязь после зимы',
    beforeImage: 'https://via.placeholder.com/400x300/1A1A1A/FFFFFF?text=До',
    afterImage: 'https://via.placeholder.com/400x300/2A2A2A/FFFFFF?text=После',
    photos: [
      'https://via.placeholder.com/400x300/1A1A1A/FFFFFF?text=Фото+1',
      'https://via.placeholder.com/400x300/2A2A2A/FFFFFF?text=Фото+2',
      'https://via.placeholder.com/400x300/3A3A3A/FFFFFF?text=Фото+3',
    ],
  },
  {
    id: '3',
    carBrand: 'Audi',
    carModel: 'A6',
    problem: 'Плесень, влага',
    beforeImage: 'https://via.placeholder.com/400x300/1A1A1A/FFFFFF?text=До',
    afterImage: 'https://via.placeholder.com/400x300/2A2A2A/FFFFFF?text=После',
    photos: [
      'https://via.placeholder.com/400x300/1A1A1A/FFFFFF?text=Фото+1',
      'https://via.placeholder.com/400x300/2A2A2A/FFFFFF?text=Фото+2',
      'https://via.placeholder.com/400x300/3A3A3A/FFFFFF?text=Фото+3',
    ],
  },
  {
    id: '4',
    carBrand: 'Toyota',
    carModel: 'Camry',
    problem: 'Дети, пятна, запах',
    beforeImage: 'https://via.placeholder.com/400x300/1A1A1A/FFFFFF?text=До',
    afterImage: 'https://via.placeholder.com/400x300/2A2A2A/FFFFFF?text=После',
    photos: [
      'https://via.placeholder.com/400x300/1A1A1A/FFFFFF?text=Фото+1',
      'https://via.placeholder.com/400x300/2A2A2A/FFFFFF?text=Фото+2',
      'https://via.placeholder.com/400x300/3A3A3A/FFFFFF?text=Фото+3',
    ],
  },
  {
    id: '5',
    carBrand: 'Volkswagen',
    carModel: 'Passat',
    problem: 'Такси, износ',
    beforeImage: 'https://via.placeholder.com/400x300/1A1A1A/FFFFFF?text=До',
    afterImage: 'https://via.placeholder.com/400x300/2A2A2A/FFFFFF?text=После',
    photos: [
      'https://via.placeholder.com/400x300/1A1A1A/FFFFFF?text=Фото+1',
      'https://via.placeholder.com/400x300/2A2A2A/FFFFFF?text=Фото+2',
      'https://via.placeholder.com/400x300/3A3A3A/FFFFFF?text=Фото+3',
    ],
  },
];
