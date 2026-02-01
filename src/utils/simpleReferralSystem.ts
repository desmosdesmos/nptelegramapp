// Простая синхронная система управления рефералами

// Ключи для хранения данных
const TOTAL_REFERRALS_KEY = 'simple_referral_total';
const BOOKED_REFERRALS_KEY = 'simple_referral_booked';
const REFERRAL_CODE_KEY = 'simple_referral_code';
const VISITED_USERS_KEY = 'simple_visited_users';

// Получить текущие значения счетчиков
export const getReferralCounts = () => {
  const total = parseInt(localStorage.getItem(TOTAL_REFERRALS_KEY) || '0', 10);
  const booked = parseInt(localStorage.getItem(BOOKED_REFERRALS_KEY) || '0', 10);
  return { total, booked };
};

// Увеличить счетчик "Привлечено"
export const incrementTotalReferrals = (referrerCode: string) => {
  // Получаем текущий счетчик
  const currentTotal = parseInt(localStorage.getItem(TOTAL_REFERRALS_KEY) || '0', 10);
  
  // Увеличиваем на 1
  const newTotal = currentTotal + 1;
  
  // Сохраняем
  localStorage.setItem(TOTAL_REFERRALS_KEY, newTotal.toString());
  
  // Сохраняем информацию о пользователе, чтобы не считать повторно
  const visitedUsers = JSON.parse(localStorage.getItem(VISITED_USERS_KEY) || '[]');
  const telegramUser = getTelegramUser();
  if (telegramUser) {
    visitedUsers.push({
      userId: telegramUser.id,
      referrerCode,
      timestamp: Date.now()
    });
    localStorage.setItem(VISITED_USERS_KEY, JSON.stringify(visitedUsers));
  }
  
  // Уведомляем о событии
  window.dispatchEvent(new CustomEvent('referralUpdate'));
  
  console.log(`Incremented total referrals to: ${newTotal}`);
};

// Увеличить счетчик "Записалось"
export const incrementBookedReferrals = () => {
  // Получаем текущий счетчик
  const currentBooked = parseInt(localStorage.getItem(BOOKED_REFERRALS_KEY) || '0', 10);
  
  // Увеличиваем на 1
  const newBooked = currentBooked + 1;
  
  // Сохраняем
  localStorage.setItem(BOOKED_REFERRALS_KEY, newBooked.toString());
  
  // Уведомляем о событии
  window.dispatchEvent(new CustomEvent('referralUpdate'));
  
  console.log(`Incremented booked referrals to: ${newBooked}`);
};

// Проверить, был ли пользователь уже учтен
export const hasUserBeenCounted = () => {
  const visitedUsers = JSON.parse(localStorage.getItem(VISITED_USERS_KEY) || '[]');
  const telegramUser = getTelegramUser();
  
  if (!telegramUser) {
    return false;
  }
  
  return visitedUsers.some((user: any) => user.userId === telegramUser.id);
};

// Сохранить реферальный код текущего пользователя
export const setCurrentUserReferralCode = (code: string) => {
  localStorage.setItem(REFERRAL_CODE_KEY, code);
};

// Получить реферальный код текущего пользователя
export const getCurrentUserReferralCode = (): string | null => {
  return localStorage.getItem(REFERRAL_CODE_KEY);
};

// Получить информацию о рефералах
export const getReferralDetails = () => {
  const visitedUsers = JSON.parse(localStorage.getItem(VISITED_USERS_KEY) || '[]');
  return visitedUsers;
};

// Вспомогательная функция для получения пользователя Telegram
const getTelegramUser = () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp.initDataUnsafe?.user || null;
  }
  return null;
};

// Функция для проверки реферального кода в URL
export const getReferralCodeFromUrl = (): string | null => {
  // Сначала проверяем URL параметры (для прямых ссылок)
  const urlParams = new URLSearchParams(window.location.search);
  const fromUrl = urlParams.get('start');
  if (fromUrl) {
    return fromUrl;
  }

  // Затем проверяем данные Telegram Web App (для запуска через бота)
  const tg = (window as any).Telegram?.WebApp;
  if (tg && tg.initDataUnsafe?.start_param) {
    return tg.initDataUnsafe.start_param;
  }

  return null;
};

// Проверить, является ли код валидным
export const isValidReferralCode = (code: string): boolean => {
  // Проверяем, соответствует ли код формату USER + 6 цифр
  const referralCodePattern = /^USER\d{6}$/;
  return referralCodePattern.test(code);
};