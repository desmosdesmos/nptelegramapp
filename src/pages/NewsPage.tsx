import React from 'react';
import { ArrowLeft } from 'lucide-react';
import NewsFeed from '../components/NewsFeed';
import { PageKey } from '../App';

interface NewsPageProps {
  onNavigate: (page: PageKey) => void;
}

const NewsPage: React.FC<NewsPageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full min-h-screen flex flex-col p-6 pt-12 pb-20 bg-black text-white">
      <button
        onClick={() => onNavigate('Home')}
        className="flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors self-start"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Назад</span>
      </button>

      <h1 className="text-3xl font-bold mb-8">Новости</h1>
      
      <NewsFeed />
    </div>
  );
};

export default NewsPage;