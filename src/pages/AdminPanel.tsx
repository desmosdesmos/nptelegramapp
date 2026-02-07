import React, { useState, useEffect } from 'react';
import { getTelegramUser } from '../utils/telegram';

// Список разрешенных Telegram ID администраторов
const ADMIN_TELEGRAM_IDS = [
  '210865441' // Замените на ваш реальный Telegram ID
];

const AdminPanel: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = () => {
      try {
        const telegramUser = getTelegramUser();
        if (telegramUser && ADMIN_TELEGRAM_IDS.includes(String(telegramUser.id))) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4">Проверка прав администратора...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center p-8 max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-4">Доступ запрещен</h1>
          <p className="text-gray-400 mb-6">
            У вас нет прав администратора для доступа к этой панели.
          </p>
          <p className="text-sm text-gray-500">
            Если вы считаете, что это ошибка, свяжитесь с владельцем приложения.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Панель администратора</h1>
          <p className="text-gray-400">Управление услугами, рулеткой и статистикой</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Карточки функций админ-панели */}
          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-cyan-400">Управление услугами</h2>
            <p className="text-gray-300 mb-4">Добавление, редактирование и удаление услуг</p>
            <button className="w-full py-2 px-4 bg-cyan-700 hover:bg-cyan-600 rounded-lg transition-colors">
              Открыть
            </button>
          </div>

          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-cyan-400">Статистика рулетки</h2>
            <p className="text-gray-300 mb-4">Просмотр истории вращений и призов</p>
            <button className="w-full py-2 px-4 bg-cyan-700 hover:bg-cyan-600 rounded-lg transition-colors">
              Открыть
            </button>
          </div>

          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-cyan-400">Реферальная статистика</h2>
            <p className="text-gray-300 mb-4">Анализ реферальных переходов и наград</p>
            <button className="w-full py-2 px-4 bg-cyan-700 hover:bg-cyan-600 rounded-lg transition-colors">
              Открыть
            </button>
          </div>

          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-cyan-400">Управление ценами</h2>
            <p className="text-gray-300 mb-4">Изменение цен на услуги</p>
            <button className="w-full py-2 px-4 bg-cyan-700 hover:bg-cyan-600 rounded-lg transition-colors">
              Открыть
            </button>
          </div>

          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-cyan-400">Настройки рулетки</h2>
            <p className="text-gray-300 mb-4">Настройка призов и вероятностей</p>
            <button className="w-full py-2 px-4 bg-cyan-700 hover:bg-cyan-600 rounded-lg transition-colors">
              Открыть
            </button>
          </div>

          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-cyan-400">Пользователи</h2>
            <p className="text-gray-300 mb-4">Просмотр и управление пользователями</p>
            <button className="w-full py-2 px-4 bg-cyan-700 hover:bg-cyan-600 rounded-lg transition-colors">
              Открыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;