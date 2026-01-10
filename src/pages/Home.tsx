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
    <div className="min-h-full flex flex-col items-center justify-center text-center px-4 py-8 fade-in">
      <div className="w-full max-w-md">
        
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-accent-primary to-accent-secondary">
            NP Auto Detail
          </h1>
          <p className="text-lg md:text-xl text-text-secondary font-medium">
            Чистота начинается здесь
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="w-full space-y-4">
          <button
            onClick={() => handleNavigation('Booking')}
            className="w-full bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-bold py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-glow active:scale-98 text-lg"
          >
            Записаться онлайн
          </button>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
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
          </div>
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
