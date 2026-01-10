import { hapticFeedback } from '../utils/telegram';
import { PageKey } from '../App';
import ScaleButton from '../components/ScaleButton'; // Keep import for now
import SparklesIcon from '../components/SparklesIcon'; // Keep import for now

interface HomeProps {
  onNavigate: (pageKey: PageKey) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {

  const handleNavigation = (pageKey: PageKey) => {
    hapticFeedback('light');
    onNavigate(pageKey);
  };

  return (
    <div className="w-full h-full flex flex-col items-center text-center">
      
      {/* 1. Hero Header */}
      <div>
        <h1>
          NP Auto Detail
        </h1>
        <div>
          <SparklesIcon />
          <p>Чистота начинается здесь</p>
        </div>
      </div>

      {/* 2. Primary Action (Pulse Button) */}
      <div>
        <ScaleButton>
          <button
            onClick={() => handleNavigation('Booking')}
          >
            Записаться онлайн
          </button>
        </ScaleButton>
      </div>
      
      {/* 3. The "Bento Grid" Navigation */}
      <div>
        {/* Card A (Services) */}
        <ScaleButton>
          <div onClick={() => handleNavigation('Services')}>
            <span>🫧</span>
            <p>Услуги</p>
          </div>
        </ScaleButton>

        {/* Card B (Portfolio) */}
        <ScaleButton>
          <div onClick={() => handleNavigation('Works')}>
            <span>📸</span>
            <p>Работы</p>
          </div>
        </ScaleButton>

        {/* Card C (Reviews) - NEW */}
        <ScaleButton>
          <div onClick={() => handleNavigation('Services')}>
            <span>⭐</span>
            <p>Отзывы</p>
            <div>5.0</div>
          </div>
        </ScaleButton>

        {/* Card D (Contacts) - Modified */}
        <ScaleButton>
          <div onClick={() => handleNavigation('Contacts')}>
            <span>📞</span>
            <p>Контакты</p>
          </div>
        </ScaleButton>
      </div>
    </div>
  );
};

export default Home;

