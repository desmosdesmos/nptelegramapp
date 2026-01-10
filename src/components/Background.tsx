// src/components/Background.tsx
import React from 'react';

const Background: React.FC = () => {
  return (
    <div
      className="fixed inset-0 z-[-1]"
      style={{
        backgroundColor: '#050505',
        pointerEvents: 'none',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(at 0% 0%, rgba(76, 29, 149, 0.4) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(34, 211, 238, 0.2) 0px, transparent 50%)',
        }}
      />
    </div>
  );
};

export default Background;
