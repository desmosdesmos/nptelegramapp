/**
 * API для работы с реферальной системой
 */

const express = require('express');
const router = express.Router();

// Временное хранилище для рефералов (в памяти)
// В продакшене нужно использовать базу данных
const referralsStore = new Map();

/**
 * Получить статистику рефералов для пользователя
 * GET /api/referrals/:userId
 */
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  
  // Получаем данные из хранилища
  const userData = referralsStore.get(userId) || {
    totalReferrals: 0,
    bookedReferrals: 0,
    totalBonuses: 0,
    referrals: []
  };
  
  res.json(userData);
});

/**
 * Обновить статистику рефералов
 * POST /api/referrals/:userId
 */
router.post('/:userId', (req, res) => {
  const { userId } = req.params;
  const { action, referralData } = req.body;
  
  // Получаем текущие данные
  const userData = referralsStore.get(userId) || {
    totalReferrals: 0,
    bookedReferrals: 0,
    totalBonuses: 0,
    referrals: []
  };
  
  if (action === 'increment_total') {
    // Увеличиваем счетчик "Привлечено"
    userData.totalReferrals += 1;
    
    // Добавляем реферала в список
    if (referralData) {
      userData.referrals.push({
        ...referralData,
        status: 'active',
        dateJoined: new Date().toISOString()
      });
    }
  } else if (action === 'increment_booked') {
    // Увеличиваем счетчик "Записалось"
    userData.bookedReferrals += 1;
    userData.totalBonuses += 300; // 300₽ за каждую запись
    
    // Обновляем статус реферала
    if (referralData && referralData.referralId) {
      const referral = userData.referrals.find(r => r.id === referralData.referralId);
      if (referral) {
        referral.status = 'completed';
        referral.serviceType = referralData.serviceType || 'комплексная химчистка';
        referral.rewardPaid = true;
      }
    }
  }
  
  // Сохраняем обновленные данные
  referralsStore.set(userId, userData);
  
  res.json({ success: true, data: userData });
});

/**
 * Получить статистику рефералов
 * GET /api/referrals/:userId/stats
 */
router.get('/:userId/stats', (req, res) => {
  const { userId } = req.params;
  
  const userData = referralsStore.get(userId) || {
    totalReferrals: 0,
    bookedReferrals: 0,
    totalBonuses: 0,
    pendingBonuses: 0
  };
  
  res.json({
    totalReferrals: userData.totalReferrals,
    bookedReferrals: userData.bookedReferrals,
    totalBonuses: userData.totalBonuses,
    pendingBonuses: 0
  });
});

/**
 * Начислить бонус за реферала
 * POST /api/referrals/award-bonus
 */
router.post('/award-bonus', (req, res) => {
  const { referrerId, referralId, bonusAmount, serviceType } = req.body;
  
  if (!referrerId || !referralId) {
    return res.status(400).json({ error: 'Missing referrerId or referralId' });
  }
  
  // Получаем данные реферера
  const referrerData = referralsStore.get(referrerId) || {
    totalReferrals: 0,
    bookedReferrals: 0,
    totalBonuses: 0,
    referrals: []
  };
  
  // Находим реферала и обновляем статус
  const referral = referrerData.referrals.find(r => r.id === referralId);
  if (referral) {
    referral.status = 'completed';
    referral.serviceType = serviceType || 'комплексная химчистка';
    referral.rewardPaid = true;
  }
  
  // Увеличиваем счетчики
  referrerData.bookedReferrals += 1;
  referrerData.totalBonuses += bonusAmount || 300;
  
  // Сохраняем обновленные данные
  referralsStore.set(referrerId, referrerData);
  
  res.json({ success: true, data: referrerData });
});

/**
 * Проверить валидность реферальной пары
 * POST /api/referrals/validate
 */
router.post('/validate', (req, res) => {
  const { referrerId, referralId } = req.body;
  
  // Простая проверка - реферер и реферал не должны быть одним лицом
  const isValid = referrerId !== referralId;
  
  res.json({ isValid });
});

module.exports = router;
