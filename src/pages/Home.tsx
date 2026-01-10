import { hapticFeedback } from '../utils/telegram';
import { PageKey } from '../App';
import './Home.css'; // Import the new CSS for responsive styles

interface HomeProps {
  onNavigate: (pageKey: PageKey) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {

  const handleNavigation = (pageKey: PageKey) => {
    hapticFeedback('light');
    onNavigate(pageKey);
  };

  return (
    <div className="w-full h-full flex flex-col text-center">
      
      {/* Header (Logo) - Fixed Size */}
      <div className="flex-shrink-0">
        <h1 className="text-4xl font-bold text-white">NP Auto Detail</h1>
        <p className="text-base text-text-secondary mt-1">Чистота начинается здесь</p>
      </div>

      {/* Spacer 1 (Large) */}
      <div className="flex-1"></div>

      {/* Main Action - Fixed Size */}
      <div className="flex-shrink-0 w-full max-w-sm mx-auto">
        <button
          onClick={() => handleNavigation('Booking')}
          className="w-full h-16 bg-[linear-gradient(90deg,#3b82f6_0%,#8b5cf6_100%)] text-white font-bold uppercase rounded-2xl soft-press"
          style={{
            boxShadow: '0 10px 25px rgba(139, 92, 246, 0.4)'
          }}
        >
          Записаться онлайн
        </button>
      </div>
      
      {/* Spacer 2 (Small) */}
      <div className="flex-[0.5]"></div>

      {/* Menu Group - Fixed Size */}
      <div className="flex-shrink-0 w-full max-w-sm mx-auto">
        <div className="w-full flex flex-col secondary-menu-container">
          <button
            onClick={() => handleNavigation('Services')}
            className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-[20px] font-bold text-white flex items-center justify-center soft-press secondary-menu-button"
          >
            Услуги и цены
          </button>
          <button
            onClick={() => handleNavigation('Works')}
            className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-[20px] font-bold text-white flex items-center justify-center soft-press secondary-menu-button"
          >
            Наши работы
          </button>
           <button
              onClick={() => handleNavigation('Contacts')}
              className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-[20px] font-bold text-white flex items-center justify-center soft-press secondary-menu-button"
            >
              Контакты
            </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
