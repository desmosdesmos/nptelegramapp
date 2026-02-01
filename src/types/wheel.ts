export interface WheelPrize {
  id: string;
  name: string;
  type: 'discount' | 'points' | 'free_service' | 'bonus_option' | 'gift';
  value: number | string; // процент скидки, количество баллов, название услуги и т.д.
  rarity: 'common' | 'rare' | 'epic' | 'legendary'; // редкость приза
  description: string;
  icon: string;
}

export interface WheelSector {
  prize: WheelPrize;
  angle: number; // угол сектора
  color: string; // цвет сектора
}

export interface WheelSpinResult {
  prize: WheelPrize;
  sectorIndex: number;
  timestamp: number;
}