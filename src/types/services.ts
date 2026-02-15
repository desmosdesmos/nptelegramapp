/**
 * Типы для услуг и цен
 */

export interface Service {
  id: string;
  name: string;
  price: number;
  description?: string;
  icon?: string;
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
