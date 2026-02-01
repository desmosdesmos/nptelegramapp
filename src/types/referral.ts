/**
 * Типы данных для реферальной системы
 */

export interface ReferralInfo {
  referralCode: string; // Простой код в формате USER123
  referralLink: string;
  totalReferrals: number; // Общее количество привлеченных
  totalBonuses: number; // Общая сумма выплаченных бонусов в рублях
  pendingBonuses: number; // Бонусы, ожидающие выплаты
  referrals: Referral[]; // Детали по каждому рефералу
}

export interface Referral {
  id: string;
  name: string;
  dateJoined: string; // ISO строка даты
  bonusAmount: number; // Размер бонуса за этого реферала
  status: 'active' | 'completed'; // Статус реферала
  serviceType?: string; // Тип услуги, например 'комплексная химчистка'
  rewardPaid: boolean; // Получен ли уже бонус
}

export interface ReferralStats {
  totalReferrals: number;
  totalBonuses: number;
  pendingBonuses: number;
  completedReferrals: number; // Количество завершенных рефералов (с оплатой)
}