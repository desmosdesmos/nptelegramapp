// src/components/Navigation.tsx
import React, { useState, useRef, createRef } from 'react';
import { motion } from 'framer-motion';
import { PageKey } from '../App';

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
  const [hoveredTab, setHoveredTab] = useState<PageKey | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  if (buttonRefs.current.length !== navButtons.length) {
    buttonRefs.current = Array(navButtons.length).fill(null).map((_, i) => buttonRefs.current[i] || createRef<HTMLButtonElement>() as any);
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const { clientX } = e;
    for (let i = 0; i < buttonRefs.current.length; i++) {
      const button = buttonRefs.current[i];
      if (button) {
        const { left, right } = button.getBoundingClientRect();
        if (clientX >= left && clientX <= right) {
          setHoveredTab(navButtons[i].key);
          return;
        }
      }
    }
  };

  const displayTab = hoveredTab || currentPage;

  return (
    <nav className="fixed bottom-[30px] left-4 right-4 z-50 h-[80px]">
      <div 
        className="w-full h-full mx-auto max-w-lg bg-[rgba(20,20,20,0.5)] backdrop-blur-[30px] rounded-[30px] border-t border-[rgba(255,255,255,0.15)] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHoveredTab(null)}
      >
        <div className="flex justify-around items-center h-full">
          {navButtons.map(({ key, label, icon }, i) => (
            <button
              key={key}
              ref={el => buttonRefs.current[i] = el}
              onClick={() => onNavigate(key)}
              className="relative flex flex-col items-center justify-center text-center w-16 h-16 rounded-lg"
            >
              {displayTab === key && (
                <motion.div
                  layoutId="activeBubble"
                  className="absolute inset-0 bg-white/15 rounded-xl z-0"
                  style={{
                    boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)'
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <motion.span
                animate={{ scale: currentPage === key ? 1.2 : 0.9 }}
                className="relative z-10 text-2xl mb-1"
              >
                {icon}
              </motion.span>
              <motion.span
                animate={{ scale: currentPage === key ? 1.1 : 0.9 }}
                className={`relative z-10 text-xs font-medium ${currentPage === key ? 'text-white' : 'text-text-secondary'}`}
              >
                {label}
              </motion.span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
