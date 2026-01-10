
import { useState } from 'react';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Services from './pages/Services';
import Works from './pages/Works';
import Contacts from './pages/Contacts';
import ErrorBoundary from './ErrorBoundary';

// Define a type for the page keys
export type PageKey = 'Home' | 'Booking' | 'Services' | 'Works' | 'Contacts';

// Define a map of pages
const appPages: Record<PageKey, { component: React.FC<any>; label: string }> = {
  Home: { component: Home, label: 'Главная' },
  Booking: { component: Booking, label: 'Запись' },
  Services: { component: Services, label: 'Услуги' },
  Works: { component: Works, label: 'Работы' },
  Contacts: { component: Contacts, label: 'Контакты' },
};

function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>('Home'); // Default to Home page

  const CurrentPageComponent = appPages[currentPage].component;

  return (
    <div className="min-h-screen bg-dark text-white flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-10 flex flex-nowrap p-2 bg-dark-secondary shadow-lg overflow-x-auto">
        {(Object.keys(appPages) as PageKey[]).map((pageKey) => (
          <button
            key={pageKey}
            onClick={() => setCurrentPage(pageKey)}
            className={`flex-shrink-0 px-4 py-2 mx-1 rounded-lg font-medium transition-colors duration-200 ${
              currentPage === pageKey ? 'bg-primary text-white' : 'text-gray-300 hover:text-white hover:bg-dark-tertiary'
            }`}
          >
            {appPages[pageKey].label}
          </button>
        ))}
      </nav>

      {/* Page Content */}
      <main className="flex-grow pt-16 pb-4"> {/* pt-16 to offset fixed nav */}
        <ErrorBoundary>
          <CurrentPageComponent onNavigate={setCurrentPage} />
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;
