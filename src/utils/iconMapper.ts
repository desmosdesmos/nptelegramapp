import React from 'react';
import {
  SparklesIcon,
  TrophyIcon,
  UserIcon,
  ArrowUpCircleIcon,
  BriefcaseIcon,
  Square2StackIcon,
  CloudIcon,
  WrenchIcon,
  TruckIcon,
  ShieldCheckIcon,
  CogIcon,
  ScissorsIcon,
  BoltIcon,
  EyeIcon,
  Square3Stack3DIcon,
  CircleStackIcon
} from '@heroicons/react/24/solid';

// Тип для иконки
type HeroIcon = React.ComponentType<any>;

/**
 * Функция для сопоставления ключевых слов в названии услуги с соответствующей иконкой
 * @param title - название услуги
 * @returns компонент иконки из heroicons/react/24/solid
 */
export const getServiceIcon = (title: string): HeroIcon => {
  const lowerTitle = title.toLowerCase();

  // INTERIOR (Салон)
  if (lowerTitle.includes('сиденье') || lowerTitle.includes('кожа')) {
    return UserIcon;
  }
  if (lowerTitle.includes('потолок')) {
    return ArrowUpCircleIcon;
  }
  if (lowerTitle.includes('пол') || lowerTitle.includes('ковролин')) {
    return Square3Stack3DIcon;
  }
  if (lowerTitle.includes('багажник')) {
    return BriefcaseIcon;
  }
  if (lowerTitle.includes('дверь') || lowerTitle.includes('дверная') || lowerTitle.includes('карта')) {
    return Square2StackIcon;
  }
  if (lowerTitle.includes('руль')) {
    return CircleStackIcon;
  }
  if (lowerTitle.includes('торпедо') || lowerTitle.includes('пластик')) {
    return Square3Stack3DIcon;
  }
  if (lowerTitle.includes('ремень')) {
    return ShieldCheckIcon;
  }

  // CLEANING & TREATMENT (Химчистка/Уход)
  if (lowerTitle.includes('полная') || lowerTitle.includes('комплекс')) {
    return SparklesIcon;
  }
  if (lowerTitle.includes('озонация') || lowerTitle.includes('запах')) {
    return CloudIcon;
  }
  if (lowerTitle.includes('кондиционер')) {
    return CogIcon;
  }
  if (lowerTitle.includes('шерсть')) {
    return ScissorsIcon;
  }

  // EXTERIOR & POLISHING (Кузов/Полировка)
  if (lowerTitle.includes('полировка') || lowerTitle.includes('керамика') || lowerTitle.includes('жидкое стекло')) {
    return WrenchIcon;
  }
  if (lowerTitle.includes('мойка') || lowerTitle.includes('кузов')) {
    return TruckIcon;
  }
  if (lowerTitle.includes('антидождь')) {
    return CloudIcon;
  }
  if (lowerTitle.includes('фары')) {
    return EyeIcon;
  }
  if (lowerTitle.includes('диски')) {
    return Square3Stack3DIcon;
  }
  if (lowerTitle.includes('двигатель') || lowerTitle.includes('мотор')) {
    return BoltIcon;
  }

  // SPECIAL CASES
  if (lowerTitle.includes('предпродажная подготовка')) {
    return TrophyIcon;
  }

  // DEFAULT FALLBACK
  return TruckIcon;
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
    sm: 'w-8 h-8 text-base',
    md: 'w-10 h-10 text-lg',
    lg: 'w-12 h-12 text-xl'
  };

  const sizeClass = sizeClasses[size];

  const containerClasses = [
    sizeClass,
    'rounded-xl flex items-center justify-center border transition-all duration-300',
    isSelected
      ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.4)]'
      : 'bg-white/5 border-white/10 text-white/50'
  ].join(' ');

  return React.createElement('div', {
    className: containerClasses
  },
    React.createElement(IconComponent, {
      className: "w-1/2 h-1/2 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50",
      strokeWidth: 1.5
    })
  );
};