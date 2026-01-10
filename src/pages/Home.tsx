import { hapticFeedback } from '../utils/telegram';
import { PageKey } from '../App';
import ScaleButton from '../components/ScaleButton';
import SparklesIcon from '../components/SparklesIcon';

interface HomeProps {
  onNavigate: (pageKey: PageKey) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {

  const handleNavigation = (pageKey: PageKey) => {
    hapticFeedback('light');
    onNavigate(pageKey);
  };

  return (
    <div className="w-full h-full flex flex-col items-center text-center px-4 pt-10 pb-[120px] gap-6">
      
      {/* 1. Hero Header */}
      <div className="flex flex-col items-center justify-center text-center mb-6">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          NP Auto Detail
        </h1>
        <div className="inline-flex items-center gap-1 py-1 px-3 mt-3 rounded-2xl backdrop-blur-md
          bg-glass border-glass-border">
          <SparklesIcon className="w-4 h-4 text-white/70" />
          <p className="text-sm text-white/70 font-medium">Чистота начинается здесь</p>
        </div>
      </div>

      {/* 2. Primary Action (Pulse Button) */}
      <div className="w-full max-w-sm mx-auto">
        <ScaleButton>
          <button
            onClick={() => handleNavigation('Booking')}
            className="w-full h-16 bg-[linear-gradient(90deg,#3b82f6_0%,#8b5cf6_100%)] text-white font-bold uppercase rounded-2xl soft-press pulse-shadow"
          >
            Записаться онлайн
          </button>
        </ScaleButton>
      </div>
      
      {/* 3. The "Bento Grid" Navigation */}
      <div className="w-full max-w-sm mx-auto grid grid-cols-2 gap-4 mt-6"> {/* Added mt-6 for separation */}
        {/* Card A (Services) */}
        <ScaleButton>
          <div 
            onClick={() => handleNavigation('Services')}
            className=""
          >
            <span className="absolute text-[6rem] opacity-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">🫧</span>
            <p className="relative z-10 font-bold text-white text-lg self-start justify-self-end mt-auto">Услуги</p>
          </div>
        </ScaleButton>

        {/* Card B (Portfolio) */}
        <ScaleButton>
          <div 
            onClick={() => handleNavigation('Works')}
            className="relative flex flex-col items-center justify-center p-4 aspect-square bg-glass-card-bg backdrop-blur-md border border-glass-card-border rounded-2xl cursor-pointer"
          >
            <span className="absolute text-[6rem] opacity-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">📸</span>
            <p className="relative z-10 font-bold text-white text-lg self-start justify-self-end mt-auto">Работы</p>
          </div>
        </ScaleButton>

        {/* Card C (Reviews) - NEW */}
        <ScaleButton>
          <div 
            onClick={() => handleNavigation('Services')} {/* Assuming reviews might be under services or a new page */}
            className="relative flex flex-col items-center justify-center p-4 aspect-square bg-glass-card-bg backdrop-blur-md border border-glass-card-border rounded-2xl cursor-pointer"
          >
            <span className="absolute text-[6rem] opacity-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">⭐</span>
            <p className="relative z-10 font-bold text-white text-lg self-start justify-self-end mt-auto">Отзывы</p>
            <div className="absolute top-3 right-3 inline-flex items-center justify-center bg-green-500/80 text-white text-xs font-bold rounded-full px-2 py-0.5 backdrop-blur-sm">
              5.0
            </div>
          </div>
        </ScaleButton>

        {/* Card D (Contacts) - Modified */}
        <ScaleButton>
          <div 
            onClick={() => handleNavigation('Contacts')}
            className="relative flex flex-col items-center justify-center p-4 aspect-square bg-glass-card-bg backdrop-blur-md border border-glass-card-border rounded-2xl cursor-pointer"
          >
            <span className="absolute text-[6rem] opacity-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">📞</span>
            <p className="relative z-10 font-bold text-white text-lg self-start justify-self-end mt-auto">Контакты</p>
          </div>
        </ScaleButton>
      </div>
    </div>
  );
};

export default Home;
