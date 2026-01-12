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
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const CurrentPageComponent = appPages[page].component;

  // Track viewport height changes to detect keyboard visibility
  React.useEffect(() => {
    const initialViewportHeight = window.innerHeight;
    let timeoutId: number; // Use number instead of NodeJS.Timeout

    const handleResize = () => {
      const currentViewportHeight = window.innerHeight;

      // If viewport height decreased significantly, keyboard might be open
      // Using 150px threshold to account for keyboard height
      if (initialViewportHeight - currentViewportHeight > 150) {
        setIsKeyboardVisible(true);
        // Clear any pending hide timeout
        if (timeoutId) {
          window.clearTimeout(timeoutId);
        }
      } else {
        // Use a delay to prevent flickering when switching between inputs
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
          setIsKeyboardVisible(false);
        }, 500); // Increased delay to prevent flickering
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.clearTimeout(timeoutId);
    };
  }, []);

  const handleNavigate = (pageKey: PageKey) => {
    hapticFeedback('light');
    setPage(pageKey);
  };

  // Dock Button with 'Spring Physics' via CSS
  const DockButton: React.FC<{
    pageKey: PageKey,
    label: string,
    icon: React.ReactNode,
  }> = ({ pageKey, label, icon }) => {
    const isActive = page === pageKey;
    return (
      <button 
        onClick={() => handleNavigate(pageKey)} 
        className={`flex flex-col items-center justify-center gap-1 w-16 h-16 transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 active:scale-90 ${isActive ? 'text-white' : 'text-white/50 hover:text-white'}`}
      >
        <div className={isActive ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : ''}>
          {icon}
        </div>
        <span className='text-[10px] font-medium'>{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <ErrorBoundary>
        <AnimatePresence mode='wait'>
          <motion.div
            key={page}
            initial={{ opacity: 0.8, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          >
            <CurrentPageComponent onNavigate={setPage} />
          </motion.div>
        </AnimatePresence>
      </ErrorBoundary>

      {/* GLOBAL BOTTOM DOCK with Spring Physics */}
      <div
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-sm h-20 px-4 bg-[#1c1c1e]/70 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-full flex items-center justify-around z-50 transition-opacity duration-300 ${
          isKeyboardVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <DockButton pageKey="Home" label="Главная" icon={<House className='w-6 h-6' />} />
        <DockButton pageKey="Booking" label="Запись" icon={<Calendar className='w-6 h-6' />} />
        <DockButton pageKey="Services" label="Услуги" icon={<Sparkles className='w-6 h-6' />} />
        <DockButton pageKey="Profile" label="Профиль" icon={<User className='w-6 h-6' />} />
      </div>
    </div>
  );
}

export default App;