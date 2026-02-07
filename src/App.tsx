import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { House, Calendar, Sparkles, User, Shield } from 'lucide-react';
import { hapticFeedback } from './utils/telegram';

// Import all pages
import Home from './pages/Home';
import Booking from './pages/Booking';
import Works from './pages/Works';
import Contacts from './pages/Contacts';
import Services from './pages/Services';
import Reviews from './pages/Reviews';
import Profile from './pages/Profile';
import ErrorBoundary from './ErrorBoundary';
import { getTelegramUser } from './utils/telegram';
import { getReferralCodeFromUrl, isValidReferralCode, hasUserBeenCounted, incrementTotalReferrals, setCurrentUserReferralCode } from './utils/simpleReferralSystem';
import WheelFortune from './components/WheelFortune';
import WheelButton from './components/WheelButton';
import { WheelSpinResult } from './types/wheel';

// Define a type for the page keys
export type PageKey = 'Home' | 'Booking' | 'Works' | 'Contacts' | 'Services' | 'Reviews' | 'Profile' | 'Admin';

// Page mapping
const appPages: Record<PageKey, { component: React.FC<any> }> = {
  Home: { component: Home },
  Booking: { component: Booking },
  Works: { component: Works },
  Contacts: { component: Contacts },
  Services: { component: Services },
  Reviews: { component: Reviews },
  Profile: { component: Profile },
  Admin: { component: React.lazy(() => import('./pages/AdminPanel')) },
};

// --- Main App Component ---
function App() {
  const [page, setPage] = useState<PageKey>('Home');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [shouldRenderDock, setShouldRenderDock] = useState(false);
  const [showWheel, setShowWheel] = useState(false);
  const CurrentPageComponent = appPages[page].component;

  // Check for referral code on app load - NEW SIMPLE SYSTEM
  useEffect(() => {
    const referralCode = getReferralCodeFromUrl();
    console.log('App loaded with referral code:', referralCode);

    if (referralCode && isValidReferralCode(referralCode)) {
      // Проверяем, был ли пользователь уже учтен
      if (!hasUserBeenCounted()) {
        // Increment total referrals counter for the referrer
        incrementTotalReferrals(referralCode);

        // Сохраняем реферальный код текущего пользователя
        const telegramUser = getTelegramUser();
        if (telegramUser) {
          const currentUserReferralCode = `USER${String(telegramUser.id).slice(-6)}`;
          setCurrentUserReferralCode(currentUserReferralCode);
        }

        console.log(`Referral visit: user came via link ${referralCode}. Incrementing "Total Referrals" counter.`);
      } else {
        console.log('User already counted for referral, skipping increment');
      }
    } else {
      console.log('No valid referral code found in URL');
    }
  }, []);

  // Setup activity tracking to process referrals when user becomes active
  useEffect(() => {
    // Заглушка для setupActivityTracking, если функция не нужна
  }, []);

  // Check for Telegram user initialization and handle pending referrer
  useEffect(() => {
    const checkAndHandlePendingReferrer = () => {
      const pendingReferrerCode = localStorage.getItem('pending_referrer_code');
      const telegramUser = getTelegramUser();

      if (pendingReferrerCode && telegramUser) {
        // Remove the pending code (we're using the new system now)
        localStorage.removeItem('pending_referrer_code');

        console.log(`Processed pending referrer: ${pendingReferrerCode} for user`);
      }
    };

    // Check immediately
    checkAndHandlePendingReferrer();

    // Check periodically in case Telegram user becomes available later
    const interval = setInterval(checkAndHandlePendingReferrer, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);


  // Track viewport height changes to detect keyboard visibility
  React.useEffect(() => {
    const initialViewportHeight = window.innerHeight;
    let timeoutId: number; // Use number instead of NodeJS.Timeout

    // Set initial state based on viewport height to prevent initial flicker
    const initialKeyboardState = window.innerHeight < initialViewportHeight - 150;
    setIsKeyboardVisible(initialKeyboardState);
    // Don't render dock immediately - wait for first resize event or delay
    setTimeout(() => setShouldRenderDock(true), 100);

    const handleResize = () => {
      const currentViewportHeight = window.innerHeight;

      // If viewport height decreased significantly, keyboard might be open
      // Using 150px threshold to account for keyboard height
      if (initialViewportHeight - currentViewportHeight > 150) {
        setIsKeyboardVisible(true);
        // Clear any pending hide timeout
        if (timeoutId) {
          window.clearTimeout(timeoutId);
        }
      } else {
        // Use a delay to prevent flickering when switching between inputs
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
          setIsKeyboardVisible(false);
        }, 500); // Increased delay to prevent flickering
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.clearTimeout(timeoutId);
    };
  }, []);

  const handleNavigate = (pageKey: PageKey) => {
    // Проверяем, является ли пользователь администратором при попытке доступа к админ-панели
    if (pageKey === 'Admin') {
      const telegramUser = getTelegramUser();
      const ADMIN_TELEGRAM_IDS = ['210865441']; // Замените на ваш реальный Telegram ID
      
      if (telegramUser && ADMIN_TELEGRAM_IDS.includes(String(telegramUser.id))) {
        hapticFeedback('light');
        setPage(pageKey);
      } else {
        // Если пользователь не администратор, показываем сообщение или остаемся на текущей странице
        alert('Доступ к админ-панели ограничен');
        return;
      }
    } else {
      hapticFeedback('light');
      setPage(pageKey);
    }
  };

  // Dock Button with 'Spring Physics' via CSS
  const DockButton: React.FC<{
    pageKey: PageKey,
    label: string,
    icon: React.ReactNode,
  }> = ({ pageKey, label, icon }) => {
    const isActive = page === pageKey;
    return (
      <button
        onClick={() => handleNavigate(pageKey)}
        className={`flex flex-col items-center justify-center gap-1 w-16 h-16 transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 active:scale-90 ${isActive ? 'text-white' : 'text-white/50 hover:text-white'}`}
      >
        <div
          className={`${
          isActive ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : ''
        } ${
          !isActive ? 'animate-float' : ''
        }`}
        >
          {icon}
        </div>
        <span className='text-[10px] font-medium'>{label}</span>
      </button>
    );
  };

  // Проверяем, является ли пользователь администратором для отображения админ-кнопки
  const isAdminUser = () => {
    const telegramUser = getTelegramUser();
    const ADMIN_TELEGRAM_IDS = ['210865441']; // Замените на ваш реальный Telegram ID
    return telegramUser && ADMIN_TELEGRAM_IDS.includes(String(telegramUser.id));
  };

  // Обработчик выигрыша в колесе
  const handleWheelWin = (result: WheelSpinResult) => {
    console.log('Выигрыш в колесе:', result);
    // Время последнего вращения уже сохранено в WheelFortune
    // Обновляем состояние в localStorage для синхронизации с WheelButton
    const now = Date.now();
    const storageEvent = new StorageEvent('storage', {
      key: 'lastSpinTime',
      oldValue: null,
      newValue: String(now),
      url: window.location.href,
      storageArea: localStorage
    });
    window.dispatchEvent(storageEvent);
  };

  const handleCloseWheel = () => {
    setShowWheel(false);
    // Обновляем состояние в localStorage для синхронизации с WheelButton
    const now = Date.now();
    const storageEvent = new StorageEvent('storage', {
      key: 'lastSpinTime',
      oldValue: null,
      newValue: String(now),
      url: window.location.href,
      storageArea: localStorage
    });
    window.dispatchEvent(storageEvent);
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden pb-24 relative" style={{paddingBottom: 'env(safe-area-inset-bottom, 0px)'}}>
      <style>{`
        /* Скрываем Vercel Toolbar */
        div[data-vercel-toolbar] {
          display: none !important;
        }
        /* Альтернативный селектор для Vercel Toolbar */
        #__next > div:last-child:not([class]) {
          display: none !important;
        }
      `}</style>
      <ErrorBoundary>
        <AnimatePresence mode='wait'>
          <motion.div
            key={page}
            initial={{ opacity: 0.8, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          >
            <CurrentPageComponent onNavigate={setPage} />
          </motion.div>
        </AnimatePresence>
      </ErrorBoundary>

      {/* GLOBAL BOTTOM DOCK with Spring Physics */}
      {shouldRenderDock && (
        <div
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-sm h-20 px-4 bg-[#1c1c1e]/70 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-full flex items-center justify-around z-50 transition-opacity duration-300 ${
            isKeyboardVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <DockButton pageKey="Home" label="Главная" icon={<House className='w-6 h-6' />} />
          <DockButton pageKey="Booking" label="Запись" icon={<Calendar className='w-6 h-6' />} />
          <DockButton pageKey="Services" label="Услуги" icon={<Sparkles className='w-6 h-6' />} />
          {isAdminUser() && (
            <DockButton pageKey="Admin" label="Админ" icon={<Shield className='w-6 h-6' />} />
          )}
          <DockButton pageKey="Profile" label="Профиль" icon={<User className='w-6 h-6' />} />
        </div>
      )}

      {/* Кнопка колеса фортуны */}
      <WheelButton onOpenWheel={() => setShowWheel(true)} />

      {/* Модальное окно колеса фортуны с анимацией выхода */}
      <AnimatePresence>
        {showWheel && (
          <motion.div
            key="wheel"
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.65,
              y: 20,
              filter: 'blur(12px)',
              transition: {
                duration: 0.42,
                ease: [0.34, 1.56, 0.64, 1]
              }
            }}
            className="fixed inset-0 z-50"
          >
            <WheelFortune
              onWin={handleWheelWin}
              onClose={handleCloseWheel}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;