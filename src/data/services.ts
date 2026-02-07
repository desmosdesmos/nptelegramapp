// src/data/services.ts
export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  duration?: string; // продолжительность услуги
  icon?: string; // иконка услуги
}

export const defaultServices: Service[] = [
  {
    id: 'basic_wash',
    name: 'Базовая мойка',
    description: 'Влажная уборка салона, мойка двигателя, мойка колес и дисков, мойка кузова',
    price: 500,
    category: 'washing',
    duration: '1 час',
    icon: '🚿'
  },
  {
    id: 'interior_detailing',
    name: 'Химчистка салона',
    description: 'Химическая чистка салона, обработка пятен, свежесть и чистота',
    price: 1500,
    category: 'detailing',
    duration: '2-3 часа',
    icon: '🧹'
  },
  {
    id: 'exterior_polish',
    name: 'Полировка кузова',
    description: 'Полировка кузова, защита от царапин, блеск и ухоженный вид',
    price: 2000,
    category: 'detailing',
    duration: '3-4 часа',
    icon: '✨'
  },
  {
    id: 'full_detailing',
    name: 'Полный детейлинг',
    description: 'Полный комплекс услуг по уходу за автомобилем',
    price: 3500,
    category: 'detailing',
    duration: '4-6 часов',
    icon: '🚗'
  },
  {
    id: 'engine_cleaning',
    name: 'Мойка двигателя',
    description: 'Химическая чистка двигателя и подкапотного пространства',
    price: 800,
    category: 'washing',
    duration: '1-2 часа',
    icon: '⚙️'
  },
  {
    id: 'wheel_care',
    name: 'Уход за дисками и шинами',
    description: 'Очистка и защита дисков и шин от загрязнений',
    price: 600,
    category: 'washing',
    duration: '1 час',
    icon: '毂'
  },
  {
    id: 'glass_treatment',
    name: 'Обработка стекол',
    description: 'Обработка стекол от запотевания и загрязнений',
    price: 400,
    category: 'detailing',
    duration: '30 мин',
    icon: '🪟'
  },
  {
    id: 'waxing',
    name: 'Нанесение воска',
    description: 'Защита лакокрасочного покрытия воском',
    price: 1200,
    category: 'protection',
    duration: '2 часа',
    icon: '🍯'
  }
];

// Функции для работы с услугами
export const getAllServices = (): Service[] => {
  const savedServices = localStorage.getItem('services');
  if (savedServices) {
    return JSON.parse(savedServices);
  }
  return defaultServices;
};

export const saveServices = (services: Service[]): void => {
  localStorage.setItem('services', JSON.stringify(services));
};

export const getServiceById = (id: string): Service | undefined => {
  const services = getAllServices();
  return services.find(service => service.id === id);
};

export const updateServicePrice = (id: string, newPrice: number): void => {
  const services = getAllServices();
  const serviceIndex = services.findIndex(service => service.id === id);
  if (serviceIndex !== -1) {
    services[serviceIndex].price = newPrice;
    saveServices(services);
  }
};

export const addService = (service: Service): void => {
  const services = getAllServices();
  services.push(service);
  saveServices(services);
};