/**
 * API функции для получения новостей из Telegram-канала
 */

interface TelegramPost {
  id: number;
  date: string;
  text: string;
  photo?: string;
  video?: string;
  views?: number;
  forwards?: number;
}

const CHANNEL_NAME = 'npdetailing';

/**
 * Получить последние посты из Telegram-канала
 */
export const getChannelPosts = async (): Promise<TelegramPost[]> => {
  try {
    // В реальном приложении здесь будет вызов API для получения постов из Telegram-канала
    // Так как Telegram не предоставляет прямого API для публичного чтения каналов,
    // можно использовать прокси-сервер или RSS-фид
    
    // Для демонстрации возвращаем фиктивные данные
    // В реальном приложении это будет заменено на реальный вызов API
    console.log(`Fetching posts from channel: ${CHANNEL_NAME}`);
    
    // Имитация задержки
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // В реальном приложении здесь будет HTTP-запрос к вашему бэкенду
    // который получает данные из Telegram-канала
    const response = await fetch('/api/channel-posts'); // Этот эндпоинт нужно будет реализовать на бэкенде
    
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    console.error('Error fetching channel posts:', error);
    
    // Возвращаем фиктивные данные в случае ошибки
    return [
      {
        id: 1,
        date: new Date(Date.now() - 86400000).toISOString(), // Вчера
        text: 'Новая услуга - комплексная химчистка салона автомобиля. Специальное предложение для новых клиентов!',
        photo: 'https://placehold.co/600x400/cccccc/333333?text=Photo+1',
        views: 125,
        forwards: 5
      },
      {
        id: 2,
        date: new Date(Date.now() - 172800000).toISOString(), // Позавчера
        text: 'Мы расширяемся! Теперь доступна химчистка ковров и сидений в наших новых филиалах.',
        photo: 'https://placehold.co/600x400/cccccc/333333?text=Photo+2',
        views: 89,
        forwards: 3
      },
      {
        id: 3,
        date: new Date(Date.now() - 259200000).toISOString(), // Три дня назад
        text: 'Акция! При заказе химчистки салона - озонирование бесплатно! Успейте воспользоваться предложением.',
        photo: 'https://placehold.co/600x400/cccccc/333333?text=Photo+3',
        views: 204,
        forwards: 12
      }
    ];
  }
};

/**
 * Получить URL для прямого доступа к посту в Telegram
 */
export const getPostUrl = (postId: number): string => {
  return `https://t.me/${CHANNEL_NAME}/${postId}`;
};