/**
 * Типы для услуг и цен
 */

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  duration?: string; // продолжительность услуги
  icon?: string; // иконка услуги
  additionalOptions?: ServiceOption[];
  needsQuantity?: boolean;
  unitLabel?: string;
}

export interface ServiceOption {
  id: string;
  name: string;
  price: number;
  icon?: string;
  description?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  services: Service[];
}
