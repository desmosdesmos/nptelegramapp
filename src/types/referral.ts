/**
 * Типы данных для реферальной системы
 */

export interface ReferralInfo {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  totalBonuses: number; // Общая сумма бонусов в рублях
  referrals: Referral[];
}

export interface Referral {
  id: string;
  name: string;
  dateJoined: string; // ISO строка даты
  bonusAmount: number; // Размер бонуса за этого реферала
  status: 'active' | 'inactive' | 'completed'; // Статус реферала
  serviceType?: string; // Тип услуги, например 'комплексная химчистка'
  rewardPaid: boolean; // Получен ли уже бонус
}

export interface ReferralStats {
  totalReferrals: number;
  totalBonuses: number;
  monthlyReferrals: number;
  pendingBonuses: number;
}