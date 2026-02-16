import React, { useState, useEffect } from 'react';
import { getChannelPosts, getPostUrl } from '../api/newsApi';

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

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <h2 className="text-2xl font-bold text-white mb-6">Новости</h2>
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
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
                <div className="h-3 bg-white/20 rounded w-4/6"></div>
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
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Новости</h2>
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-200">
          {error}
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Новости</h2>
        <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
          <p className="text-white/70">Пока нет новостей</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Новости</h2>
      <div className="space-y-6">
        {news.map(item => (
          <div key={item.id} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <span className="text-white/70 text-sm">
                  {new Date(item.date).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
                <div className="flex gap-3 text-white/60 text-xs">
                  {item.views !== undefined && (
                    <span className="flex items-center gap-1">
                      👁️ {item.views}
                    </span>
                  )}
                  {item.forwards !== undefined && (
                    <span className="flex items-center gap-1">
                      ↗️ {item.forwards}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-white whitespace-pre-wrap leading-relaxed">{item.text}</p>
              </div>
            </div>
            
            {(item.photo || item.video) && (
              <div className="relative">
                {item.photo && (
                  <img 
                    src={item.photo} 
                    alt={`Post ${item.id}`} 
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; // предотвращаем бесконечный цикл ошибок
                      target.src = 'https://placehold.co/600x400/333333/cccccc?text=Image+Not+Found';
                    }}
                  />
                )}
                
                {item.video && (
                  <video 
                    src={item.video} 
                    controls 
                    className="w-full h-64 object-cover"
                  />
                )}
              </div>
            )}
            
            <div className="p-4 pt-2">
              <a 
                href={getPostUrl(item.id)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
              >
                Читать в Telegram ↗
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;