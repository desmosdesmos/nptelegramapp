import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { House, Calendar, Sparkles, User } from 'lucide-react';
import { hapticFeedback } from './utils/telegram';

// Import all pages
import Home from './pages/Home';
import Booking from './pages/Booking';
import Works from './pages/Works';
import Contacts from './pages/Contacts';
import Services from './pages/Services';
import Reviews from './pages/Reviews';
import Profile from './pages/Profile';
import ErrorBoundary from './ErrorBoundary';

// Define a type for the page keys
export type PageKey = 'Home' | 'Booking' | 'Works' | 'Contacts' | 'Services' | 'Reviews' | 'Profile';

// Page mapping
const appPages: Record<PageKey, { component: React.FC<any> }> = {
  Home: { component: Home },
  Booking: { component: Booking },
  Works: { component: Works },
  Contacts: { component: Contacts },
  Services: { component: Services },
  Reviews: { component: Reviews },
  Profile: { component: Profile },
};

// --- Main App Component ---
function App() {
  const [page, setPage] = useState<PageKey>('Home');
  const CurrentPageComponent = appPages[page].component;

  const handleNavigate = (pageKey: PageKey) => {
    hapticFeedback('light');
    setPage(pageKey);
  }

  // A single, clean component for dock buttons with soft, physics-based animations
  const DockButton: React.FC<{
    pageKey: PageKey,
    label: string,
    icon: React.ReactNode,
  }> = ({ pageKey, label, icon }) => {
    const isActive = page === pageKey;
    return (
      <motion.button 
        onClick={() => handleNavigate(pageKey)} 
        whileTap={{ scale: 0.85 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className={`flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-full transition-colors duration-200 ${isActive ? 'text-white' : 'text-white/50 hover:text-white'}`}
      >
        <div className={isActive ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]' : ''}>
          {icon}
        </div>
        <span className='text-[10px] font-medium'>{label}</span>
      </motion.button>
    );
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <ErrorBoundary>
        <AnimatePresence mode='wait'>
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
          >
            <CurrentPageComponent onNavigate={setPage} />
          </motion.div>
        </AnimatePresence>
      </ErrorBoundary>

      {/* GLOBAL BOTTOM DOCK with soft animations */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-sm h-20 px-4 bg-[#1c1c1e]/70 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-full flex items-center justify-around z-50">
        <DockButton pageKey="Home" label="Главная" icon={<House className='w-6 h-6' />} />
        <DockButton pageKey="Booking" label="Запись" icon={<Calendar className='w-6 h-6' />} />
        <DockButton pageKey="Services" label="Услуги" icon={<Sparkles className='w-6 h-6' />} />
        <DockButton pageKey="Profile" label="Профиль" icon={<User className='w-6 h-6' />} />
      </div>
    </div>
  );
}

export default App;
