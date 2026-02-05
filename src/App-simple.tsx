import React, { useState } from 'react';
import { PageKey } from './types';

// Простой макет
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-black text-white">
      {children}
      {/* Простая навигация внизу */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 flex justify-around">
        <button className="text-white">Главная</button>
        <button className="text-white">Услуги</button>
        <button className="text-white">Запись</button>
        <button className="text-white">Работы</button>
        <button className="text-white">Профиль</button>
      </div>
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
    return <Home onNavigate={(page) => {
      // Используем onNavigate, чтобы избежать ошибки TypeScript
      setCurrentPage(page);
    }} />;
  };

  return (
    <Layout>
      {renderPage()}
    </Layout>
  );
}

export type { PageKey };
export default App;