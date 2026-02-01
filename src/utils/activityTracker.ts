import { getReferralCodeFromUrl, isValidReferralCode, incrementTotalReferrals, saveReferrerInfo, saveReferralInfo } from './referral';
import { getTelegramUser } from './telegram';

// Флаг для отслеживания, был ли уже обработан реферальный код
let referralProcessed = false;

// Проверяем, был ли пользователь перенаправлен по реферальной ссылке и обновляем счетчики при активности
export const setupActivityTracking = () => {
  const processReferralOnActivity = () => {
    if (referralProcessed) return;

    const referralCode = getReferralCodeFromUrl();
    if (referralCode && isValidReferralCode(referralCode)) {
      // Помечаем, что реферал уже обработан
      referralProcessed = true;

      // Сохраняем информацию о реферере
      saveReferrerInfo(referralCode);

      // Увеличиваем счетчик "Привлечено"
      incrementTotalReferrals(referralCode);

      // Сохраняем информацию о реферале
      const telegramUser = getTelegramUser();
      if (telegramUser) {
        const referralCodeForUser = `USER${String(telegramUser.id).slice(-6)}`;
        saveReferralInfo(referralCodeForUser, referralCode);
      }

      console.log(`Referral processed on activity: user came via link ${referralCode}. Incrementing "Total Referrals" counter.`);

      // Уведомляем о необходимости обновления данных
      window.dispatchEvent(new CustomEvent('referralUpdate'));
    }
  };

  // События, которые считаются активностью пользователя
  const events = ['click', 'scroll', 'keydown', 'touchstart', 'pointerdown'];

  // Добавляем обработчики для каждого события
  events.forEach(event => {
    window.addEventListener(event, processReferralOnActivity, { once: true, passive: true });
  });

  // Также проверяем при загрузке, если пользователь уже был инициализирован
  setTimeout(() => {
    processReferralOnActivity();
  }, 1000);
};

// Функция для принудительной проверки реферала
export const checkAndProcessReferral = () => {
  if (referralProcessed) return;

  const referralCode = getReferralCodeFromUrl();
  if (referralCode && isValidReferralCode(referralCode)) {
    // Помечаем, что реферал уже обработан
    referralProcessed = true;

    // Сохраняем информацию о реферере
    saveReferrerInfo(referralCode);

    // Увеличиваем счетчик "Привлечено"
    incrementTotalReferrals(referralCode);

    // Сохраняем информацию о реферале
    const telegramUser = getTelegramUser();
    if (telegramUser) {
      const referralCodeForUser = `USER${String(telegramUser.id).slice(-6)}`;
      saveReferralInfo(referralCodeForUser, referralCode);
    }

    console.log(`Referral processed: user came via link ${referralCode}. Incrementing "Total Referrals" counter.`);

    // Уведомляем о необходимости обновления данных
    window.dispatchEvent(new CustomEvent('referralUpdate'));
  }
};