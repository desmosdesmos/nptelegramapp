// src/components/Layout.tsx
import React from 'react';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative w-full h-full isolate">
      {/* Background Gradient Orbs */}
      <div className="background-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 w-full h-full overflow-y-auto">
        {/* Safe Area Padding Container */}
        <div 
          className="p-4 sm:p-6" 
          style={{
            paddingTop: 'calc(env(safe-area-inset-top, 0px) + 1rem)',
            paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)',
            paddingLeft: 'calc(env(safe-area-inset-left, 0px) + 1rem)',
            paddingRight: 'calc(env(safe-area-inset-right, 0px) + 1rem)',
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
