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
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const CACHE_KEY = 'np_news_cache';
const CACHE_TIMESTAMP_KEY = 'np_news_cache_timestamp';

/**
 * Получить кэшированные посты из localStorage
 */
export const getCachedPosts = (): TelegramPost[] | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    
    if (!cached || !timestamp) return null;
    
    // Проверяем, что кэш не старше 7 дней
    const cacheAge = Date.now() - parseInt(timestamp);
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 дней
    
    if (cacheAge > maxAge) {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
      return null;
    }
    
    return JSON.parse(cached);
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
};

/**
 * Сохранить посты в кэш
 */
export const savePostsToCache = (posts: TelegramPost[]): void => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(posts));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, String(Date.now()));
    console.log('Posts cached successfully:', posts.length);
  } catch (error) {
    console.error('Error saving cache:', error);
  }
};

/**
 * Получить последние посты из Telegram-канала
 */
export const getChannelPosts = async (): Promise<TelegramPost[]> => {
  console.log('Fetching posts from Telegram channel:', CHANNEL_NAME);

  try {
    const response = await fetch(`${API_BASE_URL}/api/channel-posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify({ channel: CHANNEL_NAME, limit: 10 }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const posts = data.posts || [];
    
    console.log('Successfully fetched posts:', posts.length);
    
    // Кэшируем полученные посты
    savePostsToCache(posts);
    
    return posts;
  } catch (error) {
    console.error('Error fetching channel posts:', error);
    
    // Пытаемся вернуть кэшированные данные
    const cached = getCachedPosts();
    if (cached) {
      console.log('Returning cached posts:', cached.length);
      return cached;
    }
    
    throw error;
  }
};

/**
 * Получить URL для прямого доступа к посту в Telegram
 */
export const getPostUrl = (postId: number): string => {
  return `https://t.me/${CHANNEL_NAME}/${postId}`;
};