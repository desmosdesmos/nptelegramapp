import React, { useState, useEffect } from 'react';
import { getTelegramUser, getTelegramWebApp } from '../utils/telegram';

const DebugPanel: React.FC = () => {
  const [tgAvailable, setTgAvailable] = useState<boolean | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [tgObject, setTgObject] = useState<any>(null);

  useEffect(() => {
    const tg = getTelegramWebApp();
    const user = getTelegramUser();
    
    setTgAvailable(!!tg);
    setUserData(user);
    setTgObject(tg);
    
    console.log('Telegram WebApp available:', !!tg);
    console.log('Telegram User data:', user);
    console.log('Full Telegram object:', tg);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Диагностика Telegram Web App</h1>
        
        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-cyan-400">Состояние Telegram Web App</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Telegram WebApp доступен:</span>
              <span className={tgAvailable ? 'text-green-400' : 'text-red-400'}>
                {tgAvailable ? 'ДА' : 'НЕТ'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span>Данные пользователя доступны:</span>
              <span className={userData ? 'text-green-400' : 'text-red-400'}>
                {userData ? 'ДА' : 'НЕТ'}
              </span>
            </div>
            
            {userData && (
              <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                <h3 className="font-semibold mb-2">Данные пользователя:</h3>
                <pre className="text-sm text-gray-300">
                  {JSON.stringify(userData, null, 2)}
                </pre>
              </div>
            )}
            
            {tgObject && (
              <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                <h3 className="font-semibold mb-2">Telegram WebApp объект:</h3>
                <pre className="text-sm text-gray-300">
                  {JSON.stringify({
                    platform: tgObject.platform,
                    version: tgObject.version,
                    colorScheme: tgObject.colorScheme,
                    isExpanded: tgObject.isExpanded,
                    viewportHeight: tgObject.viewportHeight,
                    viewportStableHeight: tgObject.viewportStableHeight,
                  }, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-yellow-900/20 p-6 rounded-xl border border-yellow-800">
          <h2 className="text-lg font-semibold mb-3 text-yellow-400">Инструкция</h2>
          <ul className="space-y-2 text-gray-300">
            <li>• Если Telegram WebApp НЕ доступен, приложение не запущено в Telegram</li>
            <li>• Если данные пользователя НЕ доступны, проверьте, как вы открываете приложение</li>
            <li>• Убедитесь, что вы открываете приложение через Telegram бота, а не напрямую по ссылке</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;