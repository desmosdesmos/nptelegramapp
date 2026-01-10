import { useState } from 'react';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Services from './pages/Services';
import Works from './pages/Works';
import Contacts from './pages/Contacts';
import ErrorBoundary from './ErrorBoundary';
import PageWrapper from './components/PageWrapper';
import ContentArea from './components/ContentArea';

export type PageKey = 'Home' | 'Booking' | 'Services' | 'Works' | 'Contacts';

interface NavButton {
  key: PageKey;
  label: string;
  icon: string;
}

const appPages: Record<PageKey, React.FC<any>> = {
  Home: Home,
  Booking: Booking,
  Services: Services,
  Works: Works,
  Contacts: Contacts,
};

const navButtons: NavButton[] = [
  { key: 'Home', label: 'Главная', icon: '🏠' },
  { key: 'Services', label: 'Услуги', icon: '✨' },
  { key: 'Booking', label: 'Запись', icon: '📅' },
  { key: 'Works', label: 'Работы', icon: '🚗' },
  { key: 'Contacts', label: 'Контакты', icon: '📞' },
];

function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>('Home');
  const CurrentPageComponent = appPages[currentPage];

  return (
    <PageWrapper>
      <ContentArea>
        <ErrorBoundary>
          <CurrentPageComponent onNavigate={setCurrentPage} />
        </ErrorBoundary>
      </ContentArea>

      {/* Floating Navigation Dock */}
      <nav className="fixed bottom-[30px] left-4 right-4 z-50 h-[80px]">
        <div className="w-full h-full mx-auto max-w-lg bg-[rgba(20,20,20,0.5)] backdrop-blur-[30px] rounded-[30px] border-t border-[rgba(255,255,255,0.15)] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <div className="flex justify-around items-center h-full">
            {navButtons.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setCurrentPage(key)}
                className={`soft-press flex flex-col items-center justify-center text-center w-16 h-16 rounded-lg
                  ${ currentPage === key 
                    ? 'text-accent-primary' 
                    : 'text-text-secondary hover:text-text-primary'
                  }`
                }
              >
                <span className={`text-2xl mb-1 ${currentPage === key ? 'scale-110' : 'scale-100'}`}>{icon}</span>
                <span className="text-xs font-medium">{label}</span>
                {currentPage === key && (
                  <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-accent-primary"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </PageWrapper>
  );
}

export default App;
