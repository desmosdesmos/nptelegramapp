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
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
              <div className="h-4 bg-white/20 rounded w-1/3 mb-3"></div>
              <div className="h-3 bg-white/20 rounded w-full mb-2"></div>
              <div className="h-3 bg-white/20 rounded w-5/6 mb-4"></div>
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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Новости</h2>
      <div className="space-y-6">
        {news.map(item => (
          <div key={item.id} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
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
              <p className="text-white mb-3 whitespace-pre-wrap">{item.text}</p>
            </div>
            
            {item.photo && (
              <div className="relative">
                <img 
                  src={item.photo} 
                  alt={`Post ${item.id}`} 
                  className="w-full h-64 object-cover"
                />
              </div>
            )}
            
            {item.video && (
              <div className="relative">
                <video 
                  src={item.video} 
                  controls 
                  className="w-full h-64 object-cover"
                />
              </div>
            )}
            
            <div className="p-4 pt-2">
              <a 
                href={getPostUrl(item.id)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm"
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