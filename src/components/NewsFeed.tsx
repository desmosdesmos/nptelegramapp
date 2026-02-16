import React, { useState, useEffect } from 'react';
import { getChannelPosts, getPostUrl, getCachedPosts } from '../api/newsApi';
import { ExternalLink, RefreshCw } from 'lucide-react';

interface NewsItem {
  id: number;
  date: string;
  text: string;
  photo?: string;
  video?: string;
  views?: number;
  forwards?: number;
}

const NewsFeed: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const posts = await getChannelPosts();

      // Сортируем посты от новых к старым (по дате)
      const sortedPosts = posts.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      setNews(sortedPosts);
      setError(null);
      
      // Проверяем, есть ли кэш
      const cached = getCachedPosts();
      setIsFromCache(!!cached);
      
      // Получаем время последнего обновления
      const timestamp = localStorage.getItem('np_news_cache_timestamp');
      if (timestamp) {
        const date = new Date(parseInt(timestamp));
        setLastUpdated(date.toLocaleDateString('ru-RU', { 
          day: 'numeric', 
          month: 'long',
          hour: '2-digit',
          minute: '2-digit'
        }));
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Не удалось загрузить новости. Попробуйте обновить страницу.');
    } finally {
      setLoading(false);
    }
  };

  // Разделяем текст по первому предложению или конкретным фразам
  const parsePostText = (text: string) => {
    // Ищем конкретные фразы и разделяем по ним
    const specificTitles = [
      '✨🎄 Итоги года NP 🎄✨',
      '🚚 5 машин — 5 разных историй за одну неделю',
      '🚗 Что мы сделали с Kia Cerato — полный разбор и глубокая химчистка салона'
    ];
    
    for (const phrase of specificTitles) {
      if (text.startsWith(phrase)) {
        // Нашли фразу в начале - добавляем точку и разделяем
        const title = phrase + '.';
        const content = text.slice(phrase.length).trim();
        return { title, content };
      }
    }
    
    // Ищем первую точку
    const firstDotIndex = text.indexOf('.');
    
    // Если точка есть и она не слишком близко к началу
    if (firstDotIndex > 20 && firstDotIndex < 250) {
      const title = text.slice(0, firstDotIndex + 1).trim();
      const content = text.slice(firstDotIndex + 1).trim();
      return { title, content };
    }
    
    // Ищем эмодзи в начале текста (заголовок до эмодзи)
    const emojiStartRegex = /(✨|😎|🧼|🚚|🚗|📍|📲|💎|🎄|🎁|👉|🔥|🎉)/;
    const emojiMatch = text.slice(10).match(emojiStartRegex);
    
    // Если нашли эмодзи после 10 символов
    if (emojiMatch && emojiMatch.index) {
      const titleEnd = 10 + emojiMatch.index;
      const title = text.slice(0, titleEnd).trim();
      const content = text.slice(titleEnd).trim();
      if (content.length > 20 && title.length < 200) {
        return { title, content };
      }
    }
    
    // Если не нашли, возвращаем весь текст как заголовок
    return { title: text, content: '' };
  };

  // Форматируем текст для отображения с сохранением пробелов
  const formatText = (text: string) => {
    // Добавляем пробелы после точек, если их нет
    return text.replace(/([.!?])([А-ЯA-Z🎉🔥✨📍📲🚗💎🎄🎁👉🧼😎])/g, '$1 $2');
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="h-4 bg-white/20 rounded w-1/4"></div>
                <div className="flex gap-3">
                  <div className="h-3 bg-white/20 rounded w-12"></div>
                  <div className="h-3 bg-white/20 rounded w-12"></div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-white/20 rounded w-full"></div>
                <div className="h-3 bg-white/20 rounded w-5/6"></div>
              </div>
              <div className="h-48 bg-white/10 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-200 text-center mb-4">
          {error}
        </div>
        {news.length > 0 && (
          <div className="text-center text-white/50 text-sm mb-4">
            Показаны кэшированные новости
          </div>
        )}
        <button
          onClick={fetchNews}
          className="group flex items-center justify-center gap-2 w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium text-sm transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Попробовать снова</span>
        </button>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="p-4">
        <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
          <p className="text-white/70">Пока нет новостей</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Индикатор статуса */}
      <div className="flex items-center justify-between text-xs text-white/50 mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isFromCache ? 'bg-yellow-500' : 'bg-green-500'}`} />
          <span>{isFromCache ? 'Кэш' : 'Онлайн'}</span>
        </div>
        {lastUpdated && (
          <span>Обновлено: {lastUpdated}</span>
        )}
      </div>
      
      {news.map(item => {
        const { title } = parsePostText(item.text);

        return (
          <div 
            key={item.id} 
            className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
          >
            {/* Заголовок с датой */}
            <div className="p-4 pb-2">
              <div className="flex justify-between items-start mb-2">
                <span className="text-white/60 text-xs">
                  {new Date(item.date).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long'
                  })}
                </span>
                <div className="flex gap-2 text-white/50 text-xs">
                  {item.views !== undefined && item.views > 0 && (
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      {item.views}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Изображение или видео */}
            {(item.photo || item.video) && (
              <div className="relative">
                {item.photo && (
                  <img 
                    src={item.photo} 
                    alt={`Post ${item.id}`} 
                    className="w-full h-48 object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = 'https://placehold.co/600x400/333333/cccccc?text=Image+Not+Found';
                    }}
                  />
                )}
                
                {item.video && (
                  <video 
                    src={item.video} 
                    controls 
                    className="w-full h-48 object-cover"
                  />
                )}
              </div>
            )}

            {/* Текст поста - только заголовок */}
            <div className="p-4 pt-2">
              <div 
                className="text-white font-semibold text-base mb-4 news-text-title"
                style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
              >
                {formatText(title)}
              </div>

              {/* Кнопка "Читать полностью" */}
              <a 
                href={getPostUrl(item.id)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2.5 w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500/90 to-blue-500/90 hover:from-cyan-400 hover:to-blue-400 rounded-2xl text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 active:scale-[0.98] backdrop-blur-sm"
              >
                <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                <span>Читать полностью</span>
              </a>
            </div>
          </div>
        );
      })}
      
      {/* Кнопка обновления */}
      <button
        onClick={fetchNews}
        disabled={loading}
        className="group flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-cyan-500/50 to-blue-500/50 hover:from-cyan-500/70 hover:to-blue-500/70 rounded-xl text-white font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        <span>{loading ? 'Загрузка...' : 'Обновить новости'}</span>
      </button>
    </div>
  );
};

export default NewsFeed;