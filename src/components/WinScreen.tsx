import React from 'react';
import { WheelSpinResult } from '../types/wheel';
import { motion } from 'framer-motion';

interface WinScreenProps {
  result: WheelSpinResult;
  onClose: () => void;
}

const WinScreen: React.FC<WinScreenProps> = ({ result, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
        transition={{ type: 'spring', damping: 22, stiffness: 300 }}
        className="bg-[#0a0a0a]/85 rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-lg shadow-black/20 text-center"
      >
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-black/20 border border-cyan-500/30 mb-6">
            <span className="text-5xl">🎉</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-1 font-system">Поздравляем!</h2>
          <p className="text-cyan-300 font-system text-sm">Вы выиграли:</p>
        </div>

        <div className="mb-8">
          <div
            className="text-5xl font-bold mb-2 bg-clip-text text-transparent relative z-10"
            style={{
              background: 'linear-gradient(135deg, #00f0ff, #00c0ff)',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
            }}
          >
            {result.prize.name}
          </div>
          <p className="text-white/80 text-lg font-system leading-relaxed">
            {result.prize.description}
          </p>
        </div>

        <button
          onClick={onClose}
          className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full text-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-102 active:scale-98 shadow-lg shadow-cyan-500/15"
        >
          Вернуться в приложение
        </button>
      </motion.div>
    </motion.div>
  );
};

export default WinScreen;