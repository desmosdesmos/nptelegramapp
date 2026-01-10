// src/components/Layout.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Background from './Background';
import Navigation from './Navigation';
import { PageKey } from '../App';

interface LayoutProps {
  children: React.ReactNode;
  pageKey: PageKey;
  onNavigate: (page: PageKey) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, pageKey, onNavigate }) => {
  return (
    <>
      {/* Layer 0: The Isolated Background */}
      <Background />

      {/* Layer 2: The Content Wrapper with Animated Context */}
      <AnimatePresence mode="wait">
        <motion.main
          key={pageKey}
          initial={{ opacity: 0, y: 8, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.99 }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className="relative z-10 w-full h-[100dvh] overflow-y-auto bg-transparent flex flex-col pt-5 px-4 pb-[120px]"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      {/* Layer 3: The Navigation Dock */}
      <Navigation currentPage={pageKey} onNavigate={onNavigate} />
    </>
  );
};

export default Layout;
