// src/components/ContentArea.tsx
import React from 'react';

interface ContentAreaProps {
  children: React.ReactNode;
}

const ContentArea: React.FC<ContentAreaProps> = ({ children }) => {
  return (
    <div 
      className="relative z-10 w-full min-h-full"
      style={{
        paddingTop: '20px',
        paddingLeft: '16px',
        paddingRight: '16px',
        // paddingBottom: handled by PageWrapper now
      }}
    >
      {children}
    </div>
  );
};

export default ContentArea;
