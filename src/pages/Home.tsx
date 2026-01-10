import { hapticFeedback } from '../utils/telegram';
import { PageKey } from '../App';

interface HomeProps {
  onNavigate: (pageKey: PageKey) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {

  const handleNavigation = (pageKey: PageKey) => {
    hapticFeedback('light');
    onNavigate(pageKey);
  };

  return (
    // 1. Container Structure
    <div className="w-full min-h-full flex flex-col justify-start items-center text-center px-4 pt-[80px] pb-[220px] gap-5 fade-in">
      <div className="w-full max-w-md">
        
        {/* 2. Hero Section */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-white">
            NP Auto Detail
          </h1>
          <p className="text-lg text-text-secondary mt-2">
            Чистота начинается здесь
          </p>
        </div>

        {/* 3. Primary Action Button */}
        <div className="mb-8">
          <button
            onClick={() => handleNavigation('Booking')}
            className="w-full h-16 bg-[linear-gradient(90deg,#3b82f6_0%,#8b5cf6_100%)] text-white font-bold uppercase rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-98"
            style={{
              boxShadow: '0 10px 25px rgba(139, 92, 246, 0.4)'
            }}
          >
            Записаться онлайн
          </button>
        </div>
        
        {/* 4. Secondary Menu */}
        <div className="w-full space-y-3">
          <button
            onClick={() => handleNavigation('Services')}
            className="w-full h-[60px] bg-white/5 backdrop-blur-md border border-white/10 rounded-[20px] font-bold text-white flex items-center justify-center transition-all duration-300 hover:border-white/30 active:scale-95"
          >
            Услуги и цены
          </button>
          <button
            onClick={() => handleNavigation('Works')}
            className="w-full h-[60px] bg-white/5 backdrop-blur-md border border-white/10 rounded-[20px] font-bold text-white flex items-center justify-center transition-all duration-300 hover:border-white/30 active:scale-95"
          >
            Наши работы
          </button>
           <button
              onClick={() => handleNavigation('Contacts')}
              className="w-full h-[60px] bg-white/5 backdrop-blur-md border border-white/10 rounded-[20px] font-bold text-white flex items-center justify-center transition-all duration-300 hover:border-white/30 active:scale-95"
            >
              Контакты
            </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
