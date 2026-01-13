import React from 'react';
import { motion } from 'framer-motion';
import { PageKey } from '../App';
import ScaleButton from '../components/ScaleButton';
import ServicesHeader from '../components/ServicesHeader';
import { Sparkles, Diamond, Armchair, ArrowUp } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  price: number;
  category: string;
  iconName: string;
  description?: string[];
}

// Hardcoded services data
const SERVICES: Service[] = [
  {
    id: '1',
    name: 'Полная химчистка салона',
    price: 6999,
    category: 'Interior',
    iconName: 'Sparkles',
    description: [
      'химчистка всех сидений',
      'химчистка ковролина',
      'химчистка багажника',
      'химчистка торпедо и пластика'
    ]
  },
  {
    id: '2',
    name: 'Предпродажная подготовка',
    price: 4899,
    category: 'Interior',
    iconName: 'Diamond',
    description: [
      'химчистка сидений',
      'обеспыливание',
      'пылесос',
      'пластик'
    ]
  },
  {
    id: '3',
    name: 'Сиденье (1 шт)',
    price: 1000,
    category: 'Local',
    iconName: 'ArmChair',
    description: []
  },
  {
    id: '4',
    name: 'Потолок',
    price: 3000,
    category: 'Local',
    iconName: 'ArrowUp',
    description: []
  }
];

interface ServicesProps {
  onNavigate: (pageKey: PageKey) => void;
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<any>> = {
  'Sparkles': Sparkles,
  'Sparkle': Sparkles,
  'Diamond': Diamond,
  'ArmChair': Armchair,
  'ArrowUp': ArrowUp,
  'Car': () => null, // Placeholder if needed
  'HelpCircle': () => null // Placeholder if needed
};

// Service Card Component with Vertical Stack layout
const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
  const cardVariants = { initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 } };
  
  // Get the icon component based on iconName
  const IconComponent = iconMap[service.iconName] || (() => null);
  
  return (
    <motion.div variants={cardVariants} className="relative">
      <ScaleButton>
        <div className="relative w-full p-5 sm:p-6 border rounded-3xl cursor-default bg-[rgba(255,255,255,0.05)] backdrop-blur-xl border-[rgba(255,255,255,0.1)] flex flex-col">
          <div className="relative z-10 flex flex-col h-full">
            {/* Top Row: Icon + Title */}
            <div className="flex items-start mb-3">
              <IconComponent className="text-2xl flex-shrink-0 mt-1" />
              <h4 className="text-xl font-bold text-white ml-3 flex-1 whitespace-normal break-words">
                {service.name}
              </h4>
            </div>
            
            {/* Description List */}
            {service.description && service.description.length > 0 && (
              <div className="mt-2 mb-4">
                <ul className="space-y-1">
                  {service.description.map((desc, idx) => (
                    <li key={idx} className="text-sm text-white/70 flex items-start">
                      <span className="inline-block mr-2 mt-1.5 text-xs">•</span>
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Footer: Price aligned to bottom-right */}
            <div className="mt-auto pt-4">
              <span className="text-xl sm:text-2xl font-bold text-indigo-400 self-end whitespace-nowrap">
                {service.price.toLocaleString('ru-RU')} ₽
              </span>
            </div>
          </div>
        </div>
      </ScaleButton>
    </motion.div>
  );
};

// Local Service Row Component with Vertical Stack layout
const ServiceRow: React.FC<{ service: Service }> = ({ service }) => {
  const rowVariants = { initial: { x: -20, opacity: 0 }, animate: { x: 0, opacity: 1 } };
  
  // Get the icon component based on iconName
  const IconComponent = iconMap[service.iconName] || (() => null);
  
  return (
    <motion.div variants={rowVariants}>
      <div className="flex flex-col w-full p-4 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-2xl">
        <div className="flex items-start mb-2">
          <IconComponent className="text-2xl flex-shrink-0 mt-1" />
          <div className="ml-3 flex-1">
            <h4 className="text-lg font-medium text-white whitespace-normal break-words">
              {service.name}
            </h4>
          </div>
        </div>
        
        {/* Price aligned to bottom-right */}
        <div className="mt-2 pt-2 flex justify-end">
          <span className="text-lg font-bold text-indigo-400 whitespace-nowrap">
            {service.price.toLocaleString('ru-RU')} ₽
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// Main Services Screen
const Services: React.FC<ServicesProps> = ({ onNavigate }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  };

  // Separate services by category
  const interiorServices = SERVICES.filter(service => 
    service.category === 'Interior'
  );
  
  const localServices = SERVICES.filter(service => 
    service.category === 'Local'
  );

  return (
    <div className="bg-transparent" style={{ paddingBottom: '180px' }}>
      <div className="max-w-2xl mx-auto">
        {/* Main page title is gone */}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Основные комплексы */}
          <section>
            <ServicesHeader text="Основные комплексы" />
            <div className="space-y-6">
              {interiorServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </section>

          {/* Локальная химчистка */}
          <section>
            <ServicesHeader text="Локальная химчистка" />
            <div className="space-y-3">
              {localServices.map(service => (
                <ServiceRow key={service.id} service={service} />
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