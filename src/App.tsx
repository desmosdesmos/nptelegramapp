import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { House, Calendar, Star, User } from 'lucide-react';
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

// --- Reusable Dock Components ---
const ScaleButton: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    className="flex-1"
  >
    {children}
  </motion.button>
);

const DockItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick: () => void; }> = ({ icon, label, active, onClick }) => (
  <ScaleButton>
    <div onClick={onClick} className="relative flex flex-col items-center justify-center gap-1 w-16 h-16">
      {active && <motion.div className="absolute inset-0 bg-white/10 rounded-2xl" layoutId="active-dock-item" style={{ filter: 'blur(10px)' }} />}
      <div className={`w-6 h-6 flex items-center justify-center transition-colors ${active ? 'text-white' : 'text-gray-400'}`}>
        {icon}
      </div>
      <span className={`text-[10px] font-bold transition-colors ${active ? 'text-white' : 'text-gray-400'}`}>{label}</span>
    </div>
  </ScaleButton>
);

// --- Main App Component ---
function App() {
  const [page, setPage] = useState<PageKey>('Home');

  const handleNavigate = (pageKey: PageKey) => {
    hapticFeedback('medium');
    setPage(pageKey);
  };

  const CurrentPageComponent = appPages[page].component;

  return (
    <div className="min-h-screen bg-black">
      <ErrorBoundary>
        <CurrentPageComponent onNavigate={handleNavigate} />
      </ErrorBoundary>

      {/* Global Bottom Dock */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 h-20 px-4 bg-[#1c1c1e]/70 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-full flex items-center justify-center gap-2 z-50">
        <DockItem icon={<House />} label="Главная" active={page === 'Home'} onClick={() => handleNavigate('Home')} />
        <DockItem icon={<Calendar />} label="Запись" active={page === 'Booking'} onClick={() => handleNavigate('Booking')} />
        <DockItem icon={<Star />} label="Отзывы" active={page === 'Reviews'} onClick={() => handleNavigate('Reviews')} />
        <DockItem icon={<User />} label="Профиль" active={page === 'Profile'} onClick={() => handleNavigate('Profile')} />
      </div>
    </div>
  );
}

export default App;
