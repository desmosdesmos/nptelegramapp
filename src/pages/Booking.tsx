import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { PageKey } from '../App';
import { hapticFeedback } from '../utils/telegram';

interface BookingProps {
  onNavigate: (page: PageKey) => void;
}

// Helper component for consistent form group styling
const FormGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
    {children}
  </div>
);

const Booking: React.FC<BookingProps> = ({ onNavigate }) => {
  const [serviceType, setServiceType] = useState('Комплексная химчистка');
  const [carModel, setCarModel] = useState('');
  const [phone, setPhone] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    hapticFeedback('heavy');

    const tg = window.Telegram.WebApp;
    if (!tg.initDataUnsafe.user) {
      tg.showAlert('Не удалось получить данные пользователя. Пожалуйста, перезапустите приложение.');
      return;
    }
    
    // Simple validation
    if (!carModel || !phone) {
      tg.showAlert('Пожалуйста, заполните все поля.');
      return;
    }

    const bookingData = {
      service_type: serviceType,
      car_model: carModel,
      phone: phone,
      user: tg.initDataUnsafe.user,
    };
    
    // In a real app, you would get the API URL from an environment variable
    const apiUrl = '/api/book';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      tg.showPopup({
        title: 'Заявка отправлена!',
        message: 'Мы скоро свяжемся с вами для подтверждения деталей.',
        buttons: [{ type: 'ok' }],
      });
      
      onNavigate('Home');

    } catch (error) {
      console.error('Booking submission error:', error);
      tg.showAlert('Произошла ошибка при отправке. Пожалуйста, попробуйте снова.');
    }
  };

  return (
    <div className='w-full min-h-screen flex flex-col p-6 pt-12 pb-44 bg-black text-white'>
      <button 
        onClick={() => onNavigate('Home')} 
        className='flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors self-start'
      >
        <ArrowLeft className='w-5 h-5' />
        <span className='font-medium'>Назад</span>
      </button>

      <h1 className='text-3xl font-bold mb-8'>Записаться на услугу</h1>

      <form onSubmit={handleSubmit}>
        <FormGroup label="Тип услуги">
          <div className="relative w-full p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full bg-transparent appearance-none text-white focus:outline-none"
            >
              <option className="bg-black">Комплексная химчистка</option>
              <option className="bg-black">Предпродажная подготовка</option>
              <option className="bg-black">Локальная химчистка</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </FormGroup>

        <FormGroup label="Модель автомобиля">
          <input
            type="text"
            value={carModel}
            onChange={(e) => setCarModel(e.target.value)}
            placeholder="e.g., BMW 520i"
            className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </FormGroup>

        <FormGroup label="Ваш телефон">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7 (999) 123-45-67"
            className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </FormGroup>

        <div className="mt-8">
          <button 
            type="submit" 
            className='w-full h-14 bg-gradient-to-r from-[#4c6ef5] to-[#9d4edd] text-white font-bold uppercase text-sm rounded-xl shadow-[0_0_20px_rgba(157,78,221,0.5)] transition-all duration-300 active:scale-[0.97]'
          >
            Отправить заявку
          </button>
        </div>
      </form>
    </div>
  );
};

export default Booking;