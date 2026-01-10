// src/components/ServicesHeader.tsx
import React from 'react';
import SparklesIcon from './SparklesIcon';

interface ServicesHeaderProps {
  text: string;
  icon?: React.ReactNode;
}

const ServicesHeader: React.FC<ServicesHeaderProps> = ({ text, icon }) => {
  return (
    <header className="flex flex-col items-start pt-6 pb-3 px-4"> {/* pt-24px, pb-12px, px-16px */}
      {/* The "Badge" Subtitle */}
      <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full backdrop-blur-md
        bg-[rgba(34,211,238,0.08)] border border-[rgba(34,211,238,0.3)]">
        {icon || <SparklesIcon className="w-4 h-4 text-cyan-400" />}
        <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">{text}</span>
      </div>
    </header>
  );
};

export default ServicesHeader;
