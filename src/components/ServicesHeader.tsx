// src/components/ServicesHeader.tsx
import React from 'react';
import SparklesIcon from './SparklesIcon';

interface ServicesHeaderProps {
  title: string;
  badge: string;
}

const ServicesHeader: React.FC<ServicesHeaderProps> = ({ title, badge }) => {
  return (
    <header className="relative flex flex-col items-start pt-10 px-4 pb-6">
      {/* 4. The Glow Effect */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* 3. The "Badge" Subtitle */}
      <div className="inline-flex items-center gap-2 py-2 px-4 bg-[rgba(34,211,238,0.1)] border border-[rgba(34,211,238,0.3)] rounded-full backdrop-blur-md mb-4">
        <SparklesIcon className="w-4 h-4 text-cyan-400" />
        <span className="text-cyan-400 text-sm font-bold uppercase tracking-wider">{badge}</span>
      </div>

      {/* 2. The Main Title */}
      <h2 className="text-4xl font-extrabold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
        {title}
      </h2>
    </header>
  );
};

export default ServicesHeader;
