// src/components/ServicesHeader.tsx
import React from 'react';
import SparklesIcon from './SparklesIcon';

interface ServicesHeaderProps {
  badge: string; // Only badge prop remains
}

const ServicesHeader: React.FC<ServicesHeaderProps> = ({ badge }) => {
  return (
    <header className="relative flex flex-col items-start pt-8 pb-6 mb-6"> {/* Adjusted padding and added mb-6 for separation */}
      {/* The Glow Effect (removed as it was tied to the main title) */}

      {/* The "Badge" Subtitle */}
      <div className="inline-flex items-center gap-2 py-2 px-4 bg-[rgba(34,211,238,0.1)] border border-[rgba(34,211,238,0.3)] rounded-full backdrop-blur-md">
        <SparklesIcon className="w-4 h-4 text-cyan-400" />
        <span className="text-cyan-400 text-sm font-bold uppercase tracking-wider">{badge}</span>
      </div>
    </header>
  );
};

export default ServicesHeader;
