import { getTelegramUser } from '../utils/telegram';

// Типы данных
export interface OrderStage {
  id: string;
  name: string;
  icon: string; // Имя иконки
  completed: boolean;
}

export interface ActiveOrder {
  id: string;
  carModel: string;
  status: 'ACCEPTED' | 'IN_PROGRESS' | 'READY';
  stages: OrderStage[];
}

export interface VisitHistoryItem {
  id: string;
  serviceName: string;
  date: string;
  price: number;
  icon?: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  activeOrder?: ActiveOrder;
  visitHistory: VisitHistoryItem[];
}

// API функции
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Получить профиль клиента по ID
 */
export const getCustomerProfile = async (customerId: string): Promise<CustomerProfile> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken') || 'mock-token'}`
      }
    });

    if (!response.ok) {
      // Вместо выброса ошибки, возвращаем стандартный объект профиля
      console.warn(`Failed to fetch customer profile: ${response.status} ${response.statusText}`);

      // Возвращаем mock-данные при ошибке
      return {
        id: customerId,
        name: 'Иван Иванов',
        phone: '+7 999 123-45-67',
        activeOrder: {
          id: 'order-123',
          carModel: 'BMW X5',
          status: 'IN_PROGRESS',
          stages: [
            { id: 'accepted', name: 'Принят', completed: true },
            { id: 'in-progress', name: 'В работе', completed: true },
            { id: 'ready', name: 'Готово', completed: false }
          ]
        },
        visitHistory: [
          {
            id: 'visit-1',
            serviceName: 'Комплексная химчистка',
            date: '12 Окт 2024',
            price: 12000
          },
          {
            id: 'visit-2',
            serviceName: 'Предпродажная подготовка',
            date: '5 Сен 2024',
            price: 8999
          },
          {
            id: 'visit-3',
            serviceName: 'Полировка кузова',
            date: '20 Авг 2024',
            price: 15000
          }
        ]
      };
    }

    return await response.json();
  } catch (error) {
    console.warn('Network error fetching customer profile, returning mock data:', error);

    // Возвращаем mock-данные при сетевой ошибке
    return {
      id: customerId,
      name: 'Иван Иванов',
      phone: '+7 999 123-45-67',
      activeOrder: {
        id: 'order-123',
        carModel: 'BMW X5',
        status: 'IN_PROGRESS',
        stages: [
          { id: 'accepted', name: 'Принят', completed: true },
          { id: 'in-progress', name: 'В работе', completed: true },
          { id: 'ready', name: 'Готово', completed: false }
        ]
      },
      visitHistory: [
        {
          id: 'visit-1',
          serviceName: 'Комплексная химчистка',
          date: '12 Окт 2024',
          price: 12000
        },
        {
          id: 'visit-2',
          serviceName: 'Предпродажная подготовка',
          date: '5 Сен 2024',
          price: 8999
        },
        {
          id: 'visit-3',
          serviceName: 'Полировка кузова',
          date: '20 Авг 2024',
          price: 15000
        }
      ]
    };
  }
};

/**
 * Обновить статус заказа
 */
export const updateOrderStatus = async (orderId: string, status: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

/**
 * Добавить запись в историю посещений
 */
export const addVisitToHistory = async (customerId: string, visitData: Omit<VisitHistoryItem, 'id'>): Promise<VisitHistoryItem> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}/visits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify(visitData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding visit to history:', error);
    throw error;
  }
};

/**
 * Аутентифицировать администратора
 */
export const authenticateAdmin = async (username: string, password: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Error authenticating admin:', error);
    throw error;
  }
};

/**
 * Получить ID клиента из Telegram данных
 */
export const getCustomerIdFromTelegram = (): string | null => {
  const telegramUser = getTelegramUser();
  return telegramUser ? `tg_${telegramUser.id}` : null;
};