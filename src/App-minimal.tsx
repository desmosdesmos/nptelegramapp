import React, { useState } from 'react';
import { PageKey } from './types';

// Простой макет
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-black text-white">
      {children}
    </div>
  );
};

// Простой компонент Home
const Home: React.FC<{ onNavigate: (pageKey: PageKey) => void }> = ({ onNavigate }) => {
  return (
    <div className="p-6 pt-12">
      <h1 className="text-2xl font-bold mb-4">Главная</h1>
      <p>Это главная страница</p>
    </div>
  );
};

function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>('Home');

  const renderPage = () => {
    return <Home onNavigate={setCurrentPage} />;
  };

  return (
    <Layout>
      {renderPage()}
    </Layout>
  );
}

export type { PageKey };
export default App;