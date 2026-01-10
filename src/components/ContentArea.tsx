// src/components/ContentArea.tsx
import React from 'react';

interface ContentAreaProps {
  children: React.ReactNode;
}

const ContentArea: React.FC<ContentAreaProps> = ({ children }) => {
  return (
    <main 
      className="relative z-10 w-full h-full overflow-y-auto"
      style={{
        paddingTop: '20px',
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingBottom: '120px', // Critical for floating nav
      }}
    >
      {children}
    </main>
  );
};

export default ContentArea;
