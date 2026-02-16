import React, { useState, useEffect } from 'react';
import { getChannelPosts, getPostUrl } from '../api/newsApi';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

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
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const posts = await getChannelPosts();
        setNews(posts);
        setError(null);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Не удалось загрузить новости. Попробуйте обновить страницу.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const toggleExpand = (postId: number) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const truncateText = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
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
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-200 text-center">
          {error}
        </div>
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
      {news.map(item => {
        const isExpanded = expandedPosts.has(item.id);
        const displayText = isExpanded ? item.text : truncateText(item.text, 200);
        const hasMoreText = item.text.length > 200;

        return (
          <div 
            key={item.id} 
            className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
          >
            {/* Заголовок с датой */}
            <div className="p-4 pb-3">
              <div className="flex justify-between items-start mb-2">
                <span className="text-white/60 text-xs">
                  {new Date(item.date).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
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

            {/* Текст поста */}
            <div className="p-4 pt-3">
              <div className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap mb-3">
                {displayText}
              </div>

              {/* Кнопка "Читать далее" */}
              {hasMoreText && (
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors mb-3"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Свернуть
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Читать далее
                    </>
                  )}
                </button>
              )}

              {/* Ссылка на Telegram */}
              <a 
                href={getPostUrl(item.id)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                Открыть в Telegram
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NewsFeed;