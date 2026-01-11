import React, { useState } from 'react';
import { hapticFeedback } from './utils/telegram';

import Home from './pages/Home';
import Booking from './pages/Booking';
import Services from './pages/Services';
import Works from './pages/Works';
import Contacts from './pages/Contacts';
import ErrorBoundary from './ErrorBoundary';
import Reviews from './pages/Reviews';
import Profile from './pages/Profile';

export type PageKey = 'Home' | 'Booking' | 'Services' | 'Works' | 'Contacts' | 'Reviews' | 'Profile';

const appPages: Record<string, { component: React.FC<any>; label: string }> = {
  Home: { component: Home, label: 'Главная' },
  Booking: { component: Booking, label: 'Запись' },
  Services: { component: Services, label: 'Услуги' },
  Works: { component: Works, label: 'Работы' },
  Contacts: { component: Contacts, label: 'Контакты' },
  Reviews: { component: Reviews, label: 'Отзывы' },
  Profile: { component: Profile, label: 'Профиль' },
};

function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>('Home');

  const handleNavigation = (page: PageKey) => {
    // hapticFeedback is called within the pages now
    setCurrentPage(page);
  };

  const CurrentPageComponent = appPages[currentPage].component;

  return (
    <div className="min-h-screen bg-[#000000]">
      <ErrorBoundary>
        <CurrentPageComponent onNavigate={handleNavigation} />
      </ErrorBoundary>
    </div>
  );
}

export default App;