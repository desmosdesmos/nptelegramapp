// src/components/ScaleButton.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface ScaleButtonProps {
  children: React.ReactNode;
}

const ScaleButton: React.FC<ScaleButtonProps> = ({ children }) => {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.div>
  );
};

export default ScaleButton;
