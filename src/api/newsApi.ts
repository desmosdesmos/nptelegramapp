/**
 * API функции для получения новостей
 * Работает без сервера - загружает новости из JSON-файла
 */

interface TelegramPost {
  id: number;
  date: string;
  title?: string;
  text: string;
  photo?: string;
  video?: string;
  views?: number;
  forwards?: number;
}

const CACHE_KEY = 'np_news_cache';
const CACHE_TIMESTAMP_KEY = 'np_news_cache_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 часа

/**
 * Получить кэшированные посты из localStorage
 */
export const getCachedPosts = (): TelegramPost[] | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

    if (!cached || !timestamp) return null;

    // Проверяем, что кэш не старше указанного времени
    const cacheAge = Date.now() - parseInt(timestamp);

    if (cacheAge > CACHE_DURATION) {
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
 * Получить новости из JSON-файла
 */
export const getChannelPosts = async (): Promise<TelegramPost[]> => {
  console.log('Fetching news from public/news.json');

  try {
    // Загружаем новости из JSON-файла в public папке
    const response = await fetch('/news.json', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const posts = data.posts || [];

    console.log('Successfully loaded news:', posts.length);

    // Кэшируем полученные посты
    savePostsToCache(posts);

    return posts;
  } catch (error) {
    console.error('Error fetching news:', error);

    // Пытаемся вернуть кэшированные данные
    const cached = getCachedPosts();
    if (cached) {
      console.log('Returning cached news:', cached.length);
      return cached;
    }

    // Возвращаем пустой массив в случае ошибки
    return [];
  }
};

/**
 * Получить URL для прямого доступа к посту в Telegram (если нужно)
 */
export const getPostUrl = (postId: number): string => {
  return `https://t.me/npdetailing/${postId}`;
};