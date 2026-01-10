// src/components/PageWrapper.tsx
import React from 'react';
import './PageWrapper.css';

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <div className="page-wrapper">
      {/* Background Gradient Orbs */}
      <div className="background-mesh">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>
      {children}
    </div>
  );
};

export default PageWrapper;
