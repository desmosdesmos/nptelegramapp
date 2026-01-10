import React, { useState } from 'react';
import { motion, AnimatePresence, Transition } from 'framer-motion';
import { PageKey } from '../App';
import { mainServices, localCleaningServices } from '../data/services';
import type { Service } from '../types/services';
import ScaleButton from '../components/ScaleButton';

interface ServicesProps {
  onNavigate: (pageKey: PageKey) => void;
}

// 1. The "Complex" Card (Hero Item)
const ServiceCardComplex: React.FC<{ service: Service; isSelected: boolean; onSelect: () => void }> = ({ service, isSelected, onSelect }) => {
  const cardVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } as Transition },
  };

  return (
    <motion.div variants={cardVariants} className="relative">
      <ScaleButton>
        <div
          onClick={onSelect}
          className={`relative w-full p-6 border rounded-3xl cursor-pointer transition-all duration-300
            bg-[rgba(255,255,255,0.05)] backdrop-blur-xl
            ${isSelected ? 'border-[rgba(168,85,247,0.5)]' : 'border-[rgba(255,255,255,0.1)]'}`
          }
        >
          {/* Animated Gradient Border */}
          <AnimatePresence>
            {isSelected && (
              <motion.div
                className="absolute inset-0 rounded-3xl border-2 border-transparent"
                style={{
                  borderImage: 'linear-gradient(to right, #a855f7, #22d3ee) 1',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </AnimatePresence>
          
          {/* Checkmark */}
          <AnimatePresence>
            {isSelected && (
               <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute top-4 right-4 w-7 h-7 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-full flex items-center justify-center"
               >
                 ✅
               </motion.div>
            )}
          </AnimatePresence>

          <div className="relative z-10">
            <h4 className="text-2xl font-bold mb-2 text-white">{service.name}</h4>
            {service.description && <p className="text-base text-white/70 mb-4 opacity-70" dangerouslySetInnerHTML={{ __html: service.description.replace(/\n/g, '<br />') }}></p>}
            <span className="text-4xl font-bold text-cyan-400">{service.price.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>
      </ScaleButton>
    </motion.div>
  );
};

// 2. The "Local Service" Item (Compact Row)
const ServiceRow: React.FC<{ service: Service; isSelected: boolean; onToggle: () => void }> = ({ service, isSelected, onToggle }) => {
  const rowVariants = {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } as Transition },
  };

  return (
    <motion.div variants={rowVariants}>
      <ScaleButton>
        <div 
          onClick={onToggle}
          className="flex items-center justify-between p-4 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-2xl cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <span className="text-2xl">{service.icon}</span>
            <span className="font-medium text-white">{service.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-purple-400">{service.price.toLocaleString('ru-RU')} ₽</span>
            {/* Custom Checkbox */}
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-cyan-400' : 'border-[rgba(255,255,255,0.2)]'}`}>
              <AnimatePresence>
              {isSelected && (
                <motion.div 
                  className="w-3 h-3 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                />
              )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </ScaleButton>
    </motion.div>
  );
};


const Services: React.FC<ServicesProps> = ({ onNavigate }) => {
  const [selectedComplex, setSelectedComplex] = useState<string | null>(mainServices[0]?.services[0]?.id || null);
  const [selectedLocals, setSelectedLocals] = useState<string[]>([]);

  const handleLocalToggle = (id: string) => {
    setSelectedLocals(prev => 
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="bg-transparent" style={{ paddingBottom: '180px' }}>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold mb-10 text-center text-white">Услуги и цены</h2>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Основные комплексы */}
          <section>
            <h3 className="text-2xl font-semibold pb-4 mb-6 text-white/90">
              Основные комплексы
            </h3>
            <div className="space-y-6">
              {mainServices.flatMap(cat => cat.services).map(service => (
                <ServiceCardComplex
                  key={service.id}
                  service={service}
                  isSelected={selectedComplex === service.id}
                  onSelect={() => setSelectedComplex(service.id)}
                />
              ))}
            </div>
          </section>

          {/* Химчистка отдельных зон */}
          <section>
            <h3 className="text-2xl font-semibold pb-4 mb-6 text-white/90">
              Локальная химчистка
            </h3>
            <div className="space-y-3">
              {localCleaningServices.flatMap(cat => cat.services).map(service => (
                <ServiceRow
                  key={service.id}
                  service={service}
                  isSelected={selectedLocals.includes(service.id)}
                  onToggle={() => handleLocalToggle(service.id)}
                />
              ))}
            </div>
          </section>
        </motion.div>

        <div className="mt-12">
          <ScaleButton>
            <button
              onClick={() => onNavigate('Booking')}
              className="w-full h-16 bg-[linear-gradient(90deg,#3b82f6_0%,#8b5cf6_100%)] text-white font-bold uppercase rounded-2xl"
              style={{ boxShadow: '0 10px 25px rgba(139, 92, 246, 0.4)' }}
            >
              Перейти к записи
            </button>
          </ScaleButton>
        </div>
      </div>
    </div>
  );
};

export default Services;
