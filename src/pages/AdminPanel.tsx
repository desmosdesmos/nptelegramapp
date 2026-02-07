import React, { useState, useEffect } from 'react';
import { getTelegramUser } from '../utils/telegram';
import { wheelPrizes } from '../data/wheelConfig';
import { WheelPrize } from '../types/wheel';
import { WheelSpinResult } from '../types/wheel';
import { Service, getAllServices, saveServices, addService, updateServicePrice } from '../data/services';

const AdminPanel: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [wheelResults, setWheelResults] = useState<Array<WheelSpinResult & {userId?: number, userName?: string}>>([]);
  const [visits, setVisits] = useState<{userId: number, timestamp: number, firstName: string, lastName?: string, username?: string}[]>([]);
  const [newService, setNewService] = useState<Omit<Service, 'id'>>({ 
    name: '', 
    price: 0,
    description: '',
    category: '',
    duration: '',
    icon: ''
  });
  const [newPrize, setNewPrize] = useState<Pick<WheelPrize, 'name' | 'description' | 'type' | 'value'> & { type: WheelPrize['type'] }>({ 
    name: '', 
    description: '', 
    type: 'points', 
    value: 0 
  });

  // Проверяем, является ли пользователь администратором
  useEffect(() => {
    const telegramUser = getTelegramUser();
    const ADMIN_TELEGRAM_IDS = ['478799066']; // @yanvtg
    const isAdminUser = !!(telegramUser && ADMIN_TELEGRAM_IDS.includes(String(telegramUser.id)));
    setIsAdmin(isAdminUser);
    
    if (isAdminUser) {
      // Загружаем данные для админ-панели
      loadAdminData();
    }
  }, []);

  const loadAdminData = () => {
    // Загружаем список услуг
    const allServices = getAllServices();
    setServices(allServices);

    // Загружаем результаты колеса фортуны
    const savedResults = localStorage.getItem('wheel_results');
    if (savedResults) {
      setWheelResults(JSON.parse(savedResults));
    }

    // Загружаем посещения
    const savedVisits = localStorage.getItem('admin_visits');
    if (savedVisits) {
      setVisits(JSON.parse(savedVisits));
    } else {
      // Добавляем текущий визит администратора
      const telegramUser = getTelegramUser();
      if (telegramUser) {
        const newVisit = {
          userId: telegramUser.id,
          timestamp: Date.now(),
          firstName: telegramUser.first_name,
          lastName: telegramUser.last_name,
          username: telegramUser.username
        };
        setVisits([newVisit]);
        localStorage.setItem('admin_visits', JSON.stringify([newVisit]));
      }
    }
  };

  const handleServicePriceChange = (serviceId: string, newPrice: number) => {
    updateServicePrice(serviceId, newPrice);
    // Обновляем состояние
    const updatedServices = services.map(service => 
      service.id === serviceId ? {...service, price: newPrice} : service
    );
    setServices(updatedServices);
  };

  const handleAddService = () => {
    if (!newService.name || newService.price <= 0) {
      alert('Пожалуйста, заполните все поля услуги');
      return;
    }

    const newServiceObj: Service = {
      ...newService,
      id: `service_${Date.now()}`
    };

    addService(newServiceObj);
    // Обновляем состояние
    setServices([...services, newServiceObj]);

    // Сброс формы
    setNewService({ 
      name: '', 
      price: 0,
      description: '',
      category: '',
      duration: '',
      icon: ''
    });
  };

  const handleAddPrize = () => {
    if (!newPrize.name || !newPrize.description) {
      alert('Пожалуйста, заполните все поля приза');
      return;
    }

    // В реальном приложении отправим на сервер
    const newPrizeWithDefaults: WheelPrize = {
      ...newPrize,
      id: `prize_${Date.now()}`,
      rarity: 'common', // значение по умолчанию
      icon: '🎁' // значение по умолчанию
    };
    
    console.log('Добавлен новый приз:', newPrizeWithDefaults);
    
    // Сброс формы
    setNewPrize({ 
      name: '', 
      description: '', 
      type: 'points', 
      value: 0 
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPrize(prev => ({
      ...prev,
      [name]: name === 'value' ? Number(value) : value
    }));
  };

  const handleServiceInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewService(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold">Доступ запрещен</h1>
          <p>Вы не являетесь администратором этого приложения.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Админ-панель</h1>

        {/* Управление услугами и ценами */}
        <section className="mb-12 bg-gray-900/50 p-6 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-semibold mb-6 text-cyan-400">Управление услугами и ценами</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-medium mb-4">Существующие услуги</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {services.map(service => (
                  <div key={service.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <h3 className="font-medium">{service.name}</h3>
                      <p className="text-sm text-gray-400">{service.description}</p>
                      <p className="text-xs text-gray-500">ID: {service.id}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-3">Цена:</span>
                      <input
                        type="number"
                        value={service.price}
                        onChange={(e) => handleServicePriceChange(service.id, Number(e.target.value))}
                        className="bg-gray-700 border border-gray-600 rounded px-3 py-1 w-32 text-white"
                      />
                      <span className="ml-2">₽</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-4">Добавить новую услугу</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Название услуги</label>
                  <input
                    type="text"
                    name="name"
                    value={newService.name}
                    onChange={handleServiceInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    placeholder="Например: Базовая мойка"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Цена (₽)</label>
                  <input
                    type="number"
                    name="price"
                    value={newService.price}
                    onChange={handleServiceInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    placeholder="Например: 500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Описание</label>
                  <textarea
                    name="description"
                    value={newService.description}
                    onChange={handleServiceInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    placeholder="Описание услуги"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Категория</label>
                    <input
                      type="text"
                      name="category"
                      value={newService.category}
                      onChange={handleServiceInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="Категория"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1">Продолжительность</label>
                    <input
                      type="text"
                      name="duration"
                      value={newService.duration}
                      onChange={handleServiceInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="Например: 1 час"
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleAddService}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Добавить услугу
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Управление призами колеса фортуны */}
        <section className="mb-12 bg-gray-900/50 p-6 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-semibold mb-6 text-cyan-400">Управление призами колеса фортуны</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-medium mb-4">Существующие призы</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {wheelPrizes.map((prize) => (
                  <div key={prize.id} className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium">{prize.name}</span>
                      <span className="text-cyan-400">{prize.type === 'points' ? `${prize.value} ₽` : prize.type}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{prize.description}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs mr-2">Редкость:</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        prize.rarity === 'common' ? 'bg-gray-600' :
                        prize.rarity === 'rare' ? 'bg-blue-600' :
                        prize.rarity === 'epic' ? 'bg-purple-600' : 'bg-yellow-600'
                      }`}>
                        {prize.rarity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-4">Добавить новый приз</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Название приза</label>
                  <input
                    type="text"
                    name="name"
                    value={newPrize.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    placeholder="Например: 1000₽"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Описание</label>
                  <textarea
                    name="description"
                    value={newPrize.description}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    placeholder="Описание приза"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Тип</label>
                    <select
                      name="type"
                      value={newPrize.type}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                    >
                      <option value="points">Баллы/Деньги</option>
                      <option value="free_service">Бесплатная услуга</option>
                      <option value="discount">Скидка</option>
                      <option value="bonus_option">Бонусная опция</option>
                      <option value="gift">Подарок</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1">Значение</label>
                    <input
                      type="number"
                      name="value"
                      value={newPrize.value}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                      placeholder="Значение"
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleAddPrize}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Добавить приз
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Результаты колеса фортуны */}
        <section className="mb-12 bg-gray-900/50 p-6 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-semibold mb-6 text-cyan-400">Результаты вращений колеса фортуны</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="pb-2">Время</th>
                  <th className="pb-2">Пользователь</th>
                  <th className="pb-2">Приз</th>
                  <th className="pb-2">Тип</th>
                </tr>
              </thead>
              <tbody>
                {wheelResults.length > 0 ? (
                  wheelResults.map((result, index) => (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="py-3">{new Date(result.timestamp).toLocaleString()}</td>
                      <td className="py-3">
                        {result.userName ? `${result.userName} (${result.userId})` : 'Неизвестный'}
                      </td>
                      <td className="py-3">{result.prize.name}</td>
                      <td className="py-3">{result.prize.type}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-500">
                      Нет данных о результатах колеса фортуны
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Статистика посещений */}
        <section className="mb-12 bg-gray-900/50 p-6 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-semibold mb-6 text-cyan-400">Статистика посещений</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Всего вращений</h3>
              <p className="text-3xl font-bold text-cyan-400">{wheelResults.length}</p>
            </div>
            
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Уникальных пользователей</h3>
              <p className="text-3xl font-bold text-cyan-400">{visits.length}</p>
            </div>
            
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Последнее посещение</h3>
              <p className="text-lg font-bold text-cyan-400">
                {visits.length > 0 ? new Date(visits[visits.length - 1].timestamp).toLocaleString() : 'Нет данных'}
              </p>
            </div>
          </div>

          <h3 className="text-xl font-medium mb-4">Список посетителей</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="pb-2">ID пользователя</th>
                  <th className="pb-2">Имя</th>
                  <th className="pb-2">Время посещения</th>
                </tr>
              </thead>
              <tbody>
                {visits.length > 0 ? (
                  visits.map((visit, index) => (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="py-3">{visit.userId}</td>
                      <td className="py-3">{visit.firstName} {visit.lastName || ''} {visit.username ? `(@${visit.username})` : ''}</td>
                      <td className="py-3">{new Date(visit.timestamp).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-gray-500">
                      Нет данных о посещениях
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminPanel;