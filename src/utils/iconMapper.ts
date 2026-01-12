import { 
  Armchair, 
  ArrowUp, 
  CaretDoubleUp,
  Rug, 
  Footprints, 
  Suitcase, 
  Door, 
  Wind, 
  MagicWand, 
  Sparkle, 
  Diamond,
  Briefcase, 
  CircleDashed, 
  Layout, 
  ShieldCheck, 
  Snowflake, 
  Scissors, 
  Dog, 
  Gem, 
  Droplets, 
  CloudRain, 
  Eye, 
  Disc, 
  Lightning,
  Car, 
  Star,
  Lightbulb
} from 'phosphor-react';
import type { Icon } from 'phosphor-react';

// Тип для иконки
type PhosphorIcon = React.ComponentType<any>;

/**
 * Функция для сопоставления ключевых слов в названии услуги с соответствующей иконкой
 * @param title - название услуги
 * @returns компонент иконки из phosphor-react с duotone стилем
 */
export const getServiceIcon = (title: string): PhosphorIcon => {
  const lowerTitle = title.toLowerCase();

  // INTERIOR (Салон)
  if (lowerTitle.includes('сиденье') || lowerTitle.includes('кожа')) {
    return Armchair;
  }
  if (lowerTitle.includes('потолок')) {
    return CaretDoubleUp;
  }
  if (lowerTitle.includes('пол') || lowerTitle.includes('ковролин')) {
    return Rug;
  }
  if (lowerTitle.includes('багажник')) {
    return Suitcase;
  }
  if (lowerTitle.includes('дверь') || lowerTitle.includes('дверная') || lowerTitle.includes('карта')) {
    return Door;
  }
  if (lowerTitle.includes('руль')) {
    return CircleDashed;
  }
  if (lowerTitle.includes('торпедо') || lowerTitle.includes('пластик')) {
    return Layout;
  }
  if (lowerTitle.includes('ремень')) {
    return ShieldCheck;
  }

  // CLEANING & TREATMENT (Химчистка/Уход)
  if (lowerTitle.includes('полная') || lowerTitle.includes('комплекс')) {
    return Sparkle;
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
    return MagicWand;
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
    return Lightning;
  }

  // SPECIAL CASES
  if (lowerTitle.includes('предпродажная подготовка')) {
    return Diamond;
  }

  // DEFAULT FALLBACK
  return Car;
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

  return (
    <div className={`
      ${sizeClass} 
      rounded-xl flex items-center justify-center border transition-all duration-300
      ${isSelected 
        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.4)]' 
        : 'bg-white/5 border-white/10 text-white/50'
      }
    `}>
      <IconComponent className="w-1/2 h-1/2" weight="duotone" />
    </div>
  );
};