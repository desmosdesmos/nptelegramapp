import { useState } from 'react';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Services from './pages/Services';
import Works from './pages/Works';
import Contacts from './pages/Contacts';
import ErrorBoundary from './ErrorBoundary';
import Layout from './components/Layout'; // Import the new Layout
import './App.css';

export type PageKey = 'Home' | 'Booking' | 'Services' | 'Works' | 'Contacts';

const appPages: Record<PageKey, React.FC<any>> = {
  Home,
  Booking,
  Services,
  Works,
  Contacts,
};

function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>('Home');
  const CurrentPageComponent = appPages[currentPage];

  return (
    <Layout pageKey={currentPage} onNavigate={setCurrentPage}>
      <ErrorBoundary>
        <CurrentPageComponent onNavigate={setCurrentPage} />
      </ErrorBoundary>
    </Layout>
  );
}

export default App;
