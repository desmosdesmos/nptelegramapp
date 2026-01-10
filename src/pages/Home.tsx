import { hapticFeedback } from '../utils/telegram';
import { PageKey } from '../App'; // Import PageKey from App

interface HomeProps {
  onNavigate: (pageKey: PageKey) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {

  const handleNavigation = (pageKey: PageKey) => { // Change string to PageKey
    hapticFeedback('light');
    onNavigate(pageKey);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 fade-in">
      <div className="w-full max-w-md bg-dark-glassy rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg border border-dark-tertiary">
        {/* Логотип и слоган */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            NP Auto Detail
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-medium">
            Чистота начинается здесь
          </p>
        </div>

        {/* Кнопки навигации */}
        <div className="w-full space-y-4">
        <button
          onClick={() => handleNavigation('Booking')}
          className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 text-lg"
        >
          <span className="text-2xl">🚗</span>
          <span>Записаться</span>
        </button>

        <button
          onClick={() => handleNavigation('Services')}
          className="w-full bg-dark-secondary hover:bg-dark-tertiary text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 text-lg border border-dark-tertiary"
        >
          <span className="text-2xl">💰</span>
          <span>Услуги и цены</span>
        </button>

        <button
          onClick={() => handleNavigation('Works')}
          className="w-full bg-dark-secondary hover:bg-dark-tertiary text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 text-lg border border-dark-tertiary"
        >
          <span className="text-2xl">📸</span>
          <span>Наши работы</span>
        </button>

        <button
          onClick={() => handleNavigation('Contacts')}
          className="w-full bg-dark-secondary hover:bg-dark-tertiary text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 text-lg border border-dark-tertiary"
        >
          <span className="text-2xl">📞</span>
          <span>Контакты</span>
        </button>
      </div>
      </div>
    </div>
  );
};

export default Home;
