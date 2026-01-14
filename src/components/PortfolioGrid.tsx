import React from 'react';

interface WorkItem {
  id: string;
  title: string;
  imageUrl: string;
  telegramLink: string;
}

interface PortfolioGridProps {
  works: WorkItem[];
}

const PortfolioGrid: React.FC<PortfolioGridProps> = ({ works }) => {
  const openTelegramLink = (url: string) => {
    try {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.openTelegramLink(url);
      } else {
        // Fallback: open in new tab if not in Telegram WebApp
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error('Error opening Telegram link:', error);
      // Fallback: open in new tab if there's an error
      window.open(url, '_blank');
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {works.map((work) => (
        <div
          key={work.id}
          className="relative overflow-hidden rounded-xl cursor-pointer hover:scale-[1.02] transition-transform duration-300"
          onClick={() => openTelegramLink(work.telegramLink)}
        >
          {/* Фоновое изображение */}
          <img
            src={work.imageUrl}
            alt={work.title}
            className="w-full h-48 object-cover"
          />
          
          {/* Градиентное затемнение внизу */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent"></div>
          
          {/* Название авто */}
          <div className="absolute bottom-0 left-0 p-4">
            <h3 className="text-white font-bold text-lg truncate">{work.title}</h3>
          </div>
          
          {/* Логотип бренда в правом нижнем углу */}
          <div className="absolute bottom-2 right-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">{work.title.split(' ')[0].charAt(0)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PortfolioGrid;