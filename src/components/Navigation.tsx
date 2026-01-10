// src/components/Navigation.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { PageKey } from '../App'; // Assuming PageKey is exported from App.tsx

interface NavButtonData {
  key: PageKey;
  label: string;
  icon: string;
}

const navButtons: NavButtonData[] = [
  { key: 'Home', label: 'Главная', icon: '🏠' },
  { key: 'Services', label: 'Услуги', icon: '✨' },
  { key: 'Booking', label: 'Запись', icon: '📅' },
  { key: 'Works', label: 'Работы', icon: '🚗' },
  { key: 'Contacts', label: 'Контакты', icon: '📞' },
];

interface NavigationProps {
  currentPage: PageKey;
  onNavigate: (page: PageKey) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  return (
    <nav className="fixed bottom-[30px] left-4 right-4 z-50 h-[80px]">
      <div className="w-full h-full mx-auto max-w-lg bg-[rgba(20,20,20,0.5)] backdrop-blur-[30px] rounded-[30px] border-t border-[rgba(255,255,255,0.15)] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="flex justify-around items-center h-full">
          {navButtons.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className="relative flex flex-col items-center justify-center text-center w-16 h-16 rounded-lg"
            >
              {currentPage === key && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/10 rounded-xl z-0"
                  initial={{ borderRadius: 16 }}
                  animate={{ borderRadius: 16 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className={`relative z-10 text-2xl mb-1 transition-colors ${currentPage === key ? 'text-white' : 'text-text-secondary'}`}>{icon}</span>
              <span className={`relative z-10 text-xs font-medium transition-colors ${currentPage === key ? 'text-white' : 'text-text-secondary'}`}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
