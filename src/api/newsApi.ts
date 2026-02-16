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
const API_BASE_URL = 'http://185.171.202.83:3001';

/**
 * Получить последние посты из Telegram-канала
 */
export const getChannelPosts = async (): Promise<TelegramPost[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/channel-posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ channel: CHANNEL_NAME, limit: 10 }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    console.error('Error fetching channel posts:', error);
    
    // Возвращаем пустой массив в случае ошибки
    // Компонент отобразит сообщение об ошибке
    throw error;
  }
};

/**
 * Получить URL для прямого доступа к посту в Telegram
 */
export const getPostUrl = (postId: number): string => {
  return `https://t.me/${CHANNEL_NAME}/${postId}`;
};