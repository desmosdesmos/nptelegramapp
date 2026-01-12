import React from 'react';
import {
  Armchair,
  ArrowUpFromLine,
  Footprints,
  Briefcase,
  PanelRight,
  CircleDashed,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Wind,
  Snowflake,
  Scissors,
  Gem,
  Droplets,
  CloudRain,
  Eye,
  Disc,
  Zap,
  CarFront
} from 'lucide-react';

// Тип для иконки
type LucideIcon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

/**
 * Функция для сопоставления ключевых слов в названии услуги с соответствующей иконкой
 * @param title - название услуги
 * @returns компонент иконки из lucide-react
 */
export const getServiceIcon = (title: string): LucideIcon => {
  const lowerTitle = title.toLowerCase();

  // INTERIOR (Салон)
  if (lowerTitle.includes('сиденье') || lowerTitle.includes('кожа')) {
    return Armchair;
  }
  if (lowerTitle.includes('потолок')) {
    return ArrowUpFromLine;
  }
  if (lowerTitle.includes('пол') || lowerTitle.includes('ковролин')) {
    return Footprints;
  }
  if (lowerTitle.includes('багажник')) {
    return Briefcase;
  }
  if (lowerTitle.includes('дверь') || lowerTitle.includes('дверная') || lowerTitle.includes('карта')) {
    return PanelRight;
  }
  if (lowerTitle.includes('руль')) {
    return CircleDashed;
  }
  if (lowerTitle.includes('торпедо') || lowerTitle.includes('пластик')) {
    return LayoutDashboard;
  }
  if (lowerTitle.includes('ремень')) {
    return ShieldCheck;
  }

  // CLEANING & TREATMENT (Химчистка/Уход)
  if (lowerTitle.includes('полная') || lowerTitle.includes('комплекс')) {
    return Sparkles;
  }
  if (lowerTitle.includes('озонация') || lowerTitle.includes('запах')) {
    return Wind;
  }
  if (lowerTitle.includes('кондиционер')) {
    return Snowflake;
  }
  if (lowerTitle.includes('шерсть')) {
    return Scissors;
  }

  // EXTERIOR & POLISHING (Кузов/Полировка)
  if (lowerTitle.includes('полировка') || lowerTitle.includes('керамика') || lowerTitle.includes('жидкое стекло')) {
    return Gem;
  }
  if (lowerTitle.includes('мойка') || lowerTitle.includes('кузов')) {
    return Droplets;
  }
  if (lowerTitle.includes('антидождь')) {
    return CloudRain;
  }
  if (lowerTitle.includes('фары')) {
    return Eye;
  }
  if (lowerTitle.includes('диски')) {
    return Disc;
  }
  if (lowerTitle.includes('двигатель') || lowerTitle.includes('мотор')) {
    return Zap;
  }

  // DEFAULT FALLBACK
  return CarFront;
};

/**
 * Компонент для отображения иконки услуги с iOS стилем
 */
interface ServiceIconProps {
  title: string;
  isSelected?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({ 
  title, 
  isSelected = false, 
  size = 'md' 
}) => {
  const IconComponent = getServiceIcon(title);

  // Размеры
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10', 
    lg: 'w-12 h-12'
  };

  const sizeClass = sizeClasses[size];

  const containerClasses = `${sizeClass} rounded-xl flex items-center justify-center border transition-all duration-300`;

  const selectedClasses = isSelected
    ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.4)]'
    : 'bg-white/5 border-white/10 text-white/50';

  return React.createElement('div', {
    className: containerClasses + ' ' + selectedClasses
  },
    React.createElement(IconComponent, {
      className: "w-1/2 h-1/2"
    })
  );
};