import React, { useState } from 'react';

// Используем React для useState, поэтому импорт необходим
import { PageKey } from './types';
import Layout from './components/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Works from './pages/Works';
import Reviews from './pages/Reviews';
import Profile from './pages/Profile';
import ModalWheel from './components/ModalWheel';
import WheelButton from './components/WheelButton';

function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>('Home');
  const [isWheelModalOpen, setIsWheelModalOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'Home':
        return <Home onNavigate={setCurrentPage} />;
      case 'Services':
        return <Services onNavigate={setCurrentPage} />;
      case 'Booking':
        return <Booking onNavigate={setCurrentPage} />;
      case 'Works':
        return <Works onNavigate={setCurrentPage} />;
      case 'Reviews':
        return <Reviews onNavigate={setCurrentPage} />;
      case 'Profile':
        return <Profile onNavigate={setCurrentPage} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  const openWheelModal = () => {
    setIsWheelModalOpen(true);
  };

  const closeWheelModal = () => {
    setIsWheelModalOpen(false);
  };

  return (
    <>
      <Layout pageKey={currentPage} onNavigate={setCurrentPage}>
        {renderPage()}
        <WheelButton onOpenWheel={openWheelModal} />
        <ModalWheel isOpen={isWheelModalOpen} onClose={closeWheelModal} />
      </Layout>
    </>
  );
}

export type { PageKey };
export default App;