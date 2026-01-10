import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Services from './pages/Services';
import Works from './pages/Works';
import Contacts from './pages/Contacts';
import ErrorBoundary from './ErrorBoundary';
import PageTransition from './components/PageTransition'; // Import new component
import './App.css';

export type PageKey = 'Home' | 'Booking' | 'Services' | 'Works' | 'Contacts';

interface NavButton {
  key: PageKey;
  label: string;
  icon: string;
}

const appPages: Record<PageKey, React.FC<any>> = {
  Home,
  Booking,
  Services,
  Works,
  Contacts,
};

const navButtons: NavButton[] = [
  { key: 'Home', label: 'Главная', icon: '🏠' },
  { key: 'Services', label: 'Услуги', icon: '✨' },
  { key: 'Booking', label: 'Запись', icon: '📅' },
  { key: 'Works', label: 'Работы', icon: '🚗' },
  { key: 'Contacts', label: 'Контакты', icon: '📞' },
];

const StaticBackground = () => (
  <div className="static-background">
    <div className="aurora-orb" style={{ top: '-30%', left: '-30%', width: '60vw', height: '60vw', background: 'rgba(76, 29, 149, 0.4)' }}></div>
    <div className="aurora-orb" style={{ bottom: '-30%', right: '-30%', width: '50vw', height: '50vw', background: 'rgba(34, 211, 238, 0.2)' }}></div>
  </div>
);

function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>('Home');
  const CurrentPageComponent = appPages[currentPage];

  return (
    <>
      <StaticBackground />

      <AnimatePresence mode="wait">
        <div key={currentPage} className="page-content">
          <PageTransition>
            <ErrorBoundary>
              <CurrentPageComponent onNavigate={setCurrentPage} />
            </ErrorBoundary>
          </PageTransition>
        </div>
      </AnimatePresence>

      <nav className="fixed bottom-[30px] left-4 right-4 z-50 h-[80px]">
        <div className="w-full h-full mx-auto max-w-lg bg-[rgba(20,20,20,0.5)] backdrop-blur-[30px] rounded-[30px] border-t border-[rgba(255,255,255,0.15)] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <div className="flex justify-around items-center h-full">
            {navButtons.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setCurrentPage(key)}
                className="relative soft-press flex flex-col items-center justify-center text-center w-16 h-16 rounded-lg"
              >
                {currentPage === key && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/10 rounded-lg z-0"
                    initial={{ borderRadius: 12 }}
                    animate={{ borderRadius: 12 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  ></motion.div>
                )}
                <span className={`relative z-10 text-2xl mb-1 transition-colors ${currentPage === key ? 'text-white' : 'text-text-secondary'}`}>{icon}</span>
                <span className={`relative z-10 text-xs font-medium transition-colors ${currentPage === key ? 'text-white' : 'text-text-secondary'}`}>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}

export default App;
