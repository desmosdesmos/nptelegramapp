import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Services from './pages/Services';
import Works from './pages/Works';
import Contacts from './pages/Contacts';
import ErrorBoundary from './ErrorBoundary';
import './App.css'; // Import the new CSS

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

// Layer 1: The Static Background
const StaticBackground = () => (
  <div className="static-background">
    {/* Top-left Purple Orb */}
    <div 
      className="aurora-orb"
      style={{ top: '-30%', left: '-30%', width: '60vw', height: '60vw', background: 'rgba(76, 29, 149, 0.4)' }}
    ></div>
    {/* Bottom-right Cyan Orb */}
    <div 
      className="aurora-orb"
      style={{ bottom: '-30%', right: '-30%', width: '50vw', height: '50vw', background: 'rgba(34, 211, 238, 0.2)' }}
    ></div>
  </div>
);


function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>('Home');
  const CurrentPageComponent = appPages[currentPage];

  return (
    <>
      <StaticBackground />

      {/* Layer 2: Animated Content Wrapper */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3, ease: "circOut" }}
          className="page-content"
        >
          <ErrorBoundary>
            <CurrentPageComponent onNavigate={setCurrentPage} />
          </ErrorBoundary>
        </motion.div>
      </AnimatePresence>

      {/* Layer 3: The Navigation Dock */}
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
    </>
  );
}

export default App;
