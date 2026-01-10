
import { useState, CSSProperties } from 'react';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Services from './pages/Services';
import Works from './pages/Works';
import Contacts from './pages/Contacts';
import ErrorBoundary from './ErrorBoundary';

// Define a type for the page keys
export type PageKey = 'Home' | 'Booking' | 'Services' | 'Works' | 'Contacts';

interface NavButton {
  key: PageKey;
  label: string;
  icon: string; // Add icon for visual appeal
}

// Define a map of pages
const appPages: Record<PageKey, React.FC<any>> = {
  Home: Home,
  Booking: Booking,
  Services: Services,
  Works: Works,
  Contacts: Contacts,
};

const navButtons: NavButton[] = [
  { key: 'Home', label: 'Главная', icon: '🏠' },
  { key: 'Services', label: 'Услуги', icon: '✨' },
  { key: 'Booking', label: 'Запись', icon: '📅' },
  { key: 'Works', label: 'Работы', icon: '🚗' },
  { key: 'Contacts', label: 'Контакты', icon: '📞' },
];

function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>('Home');

  const CurrentPageComponent = appPages[currentPage];

  return (
    // The main container no longer needs a background color, as it's on the body
    <div className="min-h-screen text-text-primary flex flex-col">
      
      {/* Page Content */}
      {/* The pt-24 provides space for the floating nav bar below */}
      <main className="flex-grow pt-28 pb-24">
        <ErrorBoundary>
          <CurrentPageComponent onNavigate={setCurrentPage} />
        </ErrorBoundary>
      </main>
      
      {/* Futuristic Glassmorphism Bottom Navigation */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-20"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto max-w-lg bg-glass/80 backdrop-blur-xl border-t border-glass-border rounded-t-2xl">
          <div className="flex justify-around items-center p-2">
            {navButtons.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setCurrentPage(key)}
                className={`flex flex-col items-center justify-center text-center w-16 h-16 rounded-lg transition-all duration-300
                  ${ currentPage === key 
                    ? 'text-accent-primary' 
                    : 'text-text-secondary hover:text-text-primary'
                  }`
                }
              >
                <span className={`text-2xl mb-1 transition-all duration-300 ${currentPage === key ? 'scale-110' : 'scale-100'}`}>{icon}</span>
                <span className="text-xs font-medium">{label}</span>
                {currentPage === key && (
                  <div className="w-2 h-2 mt-1 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

    </div>
  );
}

export default App;
