import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react'; 
import { PageKey } from '../App';
import { getTelegramWebApp, hapticFeedback, notificationFeedback, getTelegramUser } from '../utils/telegram';
import { sendBookingToTelegram, validateBookingForm, type BookingFormData } from '../utils/booking';
import { mainServices, localCleaningServices, getServiceById, getServiceOptionById } from '../data/services';
import { getAllBrands, getModelsByBrand } from '../data/carBrands';
import type { Service } from '../types/services';

interface BookingProps {
  onNavigate: (page: PageKey) => void;
}

// Re-defining FormSection with the new glass style
const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl mb-6 shadow-xl">
    <h3 className="text-xl font-bold text-white pb-4 mb-6 border-b border-white/10">{title}</h3>
    <div className="space-y-6">
      {children}
    </div>
  </div>
);

// Re-defining ServiceRadioOption with glass style and animations
const ServiceRadioOption: React.FC<{ 
  service: Service;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ service, isSelected, onSelect }) => (
  <button
    onClick={onSelect}
    className={`w-full p-4 rounded-2xl border transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 active:scale-90 text-left
      ${isSelected 
        ? 'bg-blue-600/20 border-blue-500/50 shadow-lg' 
        : 'bg-white/5 border-white/10 hover:border-blue-500/20'
      }
    `}
  >
    <div className="flex items-center">
      <div className={`w-5 h-5 flex-shrink-0 border-2 rounded-full flex items-center justify-center mr-4 ${isSelected ? 'border-blue-500' : 'border-white/30'}`}>
        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-blue-500/50" />}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {service.icon && <span className="text-xl">{service.icon}</span>}
            <span className="font-medium text-white">{service.name}</span>
          </div>
          <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            {service.price.toLocaleString('ru-RU')} ₽
          </span>
        </div>
        {service.description && <p className="text-sm text-gray-400 mt-1" dangerouslySetInnerHTML={{ __html: service.description.replace(/\n/g, '<br />') }}></p>}
      </div>
    </div>
  </button>
);

// Re-defining ServiceCheckboxOption with glass style and animations
const ServiceCheckboxOption: React.FC<{ 
  service: Service;
  isSelected: boolean;
  onToggle: () => void;
  quantity: number;
  onQuantityChange: (delta: number) => void;
}> = ({ service, isSelected, onToggle, quantity, onQuantityChange }) => (
  <button
    onClick={onToggle}
    className={`w-full p-4 rounded-2xl border transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 active:scale-90 text-left
      ${isSelected 
        ? 'bg-blue-600/20 border-blue-500/50 shadow-lg' 
        : 'bg-white/5 border-white/10 hover:border-blue-500/20'
      }
    `}
  >
    <div className="flex items-start">
      <div className={`w-5 h-5 flex-shrink-0 border-2 rounded-md mt-1 flex items-center justify-center mr-4 ${isSelected ? 'border-blue-500' : 'border-white/30'}`}>
        {isSelected && <div className="w-2.5 h-2.5 rounded-sm bg-blue-500 shadow-blue-500/50" />}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {service.icon && <span className="text-xl">{service.icon}</span>}
            <span className="font-medium text-white">{service.name}</span>
            {service.unitLabel && <span className="text-sm text-gray-400">{service.unitLabel}</span>}
          </div>
          <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            {service.price.toLocaleString('ru-RU')} ₽
          </span>
        </div>
        {service.description && <p className="text-sm text-gray-400 mt-1" dangerouslySetInnerHTML={{ __html: service.description.replace(/\n/g, '<br />') }}></p>}
      </div>
    </div>
    {service.needsQuantity && isSelected && (
      <div className="mt-4 flex items-center justify-center gap-4">
        <button 
          type="button" 
          onClick={(e) => { e.stopPropagation(); hapticFeedback('light'); onQuantityChange(-1); }}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white text-xl font-bold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 active:scale-90"
        >
          -
        </button>
        <span className="text-xl font-semibold w-10 text-center text-white">{quantity}</span>
        <button 
          type="button" 
          onClick={(e) => { e.stopPropagation(); hapticFeedback('light'); onQuantityChange(1); }}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white text-xl font-bold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 active:scale-90"
        >
          +
        </button>
      </div>
    )}
  </button>
);


const Booking: React.FC<BookingProps> = ({ onNavigate }) => {
  const tg = getTelegramWebApp(); // Correct usage of utility
  const telegramUser = getTelegramUser();

  const [formData, setFormData] = useState<Omit<BookingFormData, 'quantities'>>({
    name: telegramUser?.first_name || '',
    phone: '+7',
    carBrand: '',
    carModel: '',
    services: [], 
    additionalOptions: [],
    date: '',
    time: '', // Not used in this simplified UI
    comment: '',
  });

  const [quantities, setQuantities] = useState<{ [serviceId: string]: number }>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [suggestedBrands, setSuggestedBrands] = useState<string[]>([]);
  const [suggestedModels, setSuggestedModels] = useState<string[]>([]);
  const [showBrandSuggestions, setShowBrandSuggestions] = useState(false);
  const [showModelSuggestions, setShowModelSuggestions] = useState(false);

  const allBrands = getAllBrands();

  const totalPrice = useMemo(() => {
    let total = 0;

    formData.services.forEach(serviceId => {
      const service = getServiceById(serviceId);
      if (service) {
        const quantity = quantities[serviceId] || 1;
        total += service.price * quantity;
      }
    });

    const mainServiceId = formData.services.find(id => 
      mainServices.flatMap(cat => cat.services).some(s => s.id === id)
    );
    if (mainServiceId) {
      formData.additionalOptions.forEach(optionId => {
        const option = getServiceOptionById(mainServiceId, optionId);
        if (option) {
          total += option.price;
        }
      });
    }
    
    return total;
  }, [formData.services, formData.additionalOptions, quantities]);

  useEffect(() => {
    // Hide default main button when in Booking page to use custom form submission button
    if (tg) {
      tg.MainButton.hide();
    }
    // Cleanup function
    return () => {
      if (tg) {
        tg.MainButton.show(); // Show it back when component unmounts
      }
    };
  }, [tg]);
    
  const handleChange = (field: keyof Omit<BookingFormData, 'quantities'>, value: any) => {
    hapticFeedback('light'); // Added haptic feedback for input changes
    
    let processedValue = value;
    if (field === 'phone') {
      // Clean the input: remove all non-digits except for a leading '+'
      const cleanValue = processedValue.replace(/[^+\d]/g, '');

      if (cleanValue === '' || cleanValue === '+') {
        processedValue = '+7';
      } else if (!cleanValue.startsWith('+7')) {
        // If it doesn't start with +7, prepend it.
        // Also handle cases like '89...' -> '+79...'
        // or '79...' -> '+79...'
        const digitsOnly = cleanValue.replace(/\D/g, ''); // Get only digits
        if (digitsOnly.startsWith('7')) {
          processedValue = '+7' + digitsOnly.substring(1); // Remove leading 7 if present
        } else if (digitsOnly.startsWith('8')) {
            processedValue = '+7' + digitsOnly.substring(1); // Remove leading 8 if present
        }
        else {
            processedValue = '+7' + digitsOnly;
        }
      } else {
          processedValue = cleanValue; // Keep the clean +7... value
      }
    }

    const isCarBrandChange = field === 'carBrand';
    const newBrand = isCarBrandChange ? (processedValue as string) : formData.carBrand;

    setFormData(prev => {
      const newData = { ...prev, [field]: processedValue };
      if (isCarBrandChange && prev.carBrand !== processedValue) {
        newData.carModel = '';
      }
      return newData;
    });

    if (errors[field as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }

    if (isCarBrandChange && typeof processedValue === 'string') {
      const input = processedValue.toLowerCase();
      if (input.length > 0) {
        const filtered = allBrands.filter(brand => brand.toLowerCase().includes(input)).slice(0, 5);
        setSuggestedBrands(filtered);
        setShowBrandSuggestions(true);
      } else {
        setSuggestedBrands([]);
        setShowBrandSuggestions(false);
      }
    }

    if (field === 'carModel' && typeof processedValue === 'string') {
      const models = getModelsByBrand(newBrand);
      const input = processedValue.toLowerCase();
      if (input.length > 0 && models.length > 0) {
        const filtered = models.filter(model => model.toLowerCase().includes(input)).slice(0, 5);
        setSuggestedModels(filtered);
        setShowModelSuggestions(true);
      } else {
        setSuggestedModels([]);
        setShowModelSuggestions(false);
      }
    }
  };

  const handleMainServiceChange = (serviceId: string) => {
    hapticFeedback('light');
    const isAlreadySelected = formData.services.includes(serviceId);
    if (isAlreadySelected) {
      handleChange('services', []);
    } else {
      handleChange('services', [serviceId]);
    }
    handleChange('additionalOptions', []);
  };

  const handleLocalServiceToggle = (serviceId: string) => {
    hapticFeedback('light');
    const currentServices = formData.services;
    const isCurrentlySelected = currentServices.includes(serviceId);

    // Если основная услуга уже выбрана, не даем выбрать локальную
    const hasMainService = formData.services.some(id => mainServices.flatMap(cat => cat.services).some(s => s.id === id));
    if(hasMainService && !isCurrentlySelected) {
        notificationFeedback('error');
        tg?.showAlert('Нельзя комбинировать основную услугу с локальными.');
        return;
    }
      
    const newServices = isCurrentlySelected
      ? currentServices.filter(id => id !== serviceId)
      : [...currentServices, serviceId];

    handleChange('services', newServices);

    const service = getServiceById(serviceId);
    if (service?.needsQuantity && !quantities[serviceId]) {
      setQuantities(prev => ({ ...prev, [serviceId]: 1 }));
    }
  };

  const handleQuantityChange = (serviceId: string, delta: number) => {
    hapticFeedback('light');
    setQuantities(prev => {
      const currentQuantity = prev[serviceId] || 1;
      const newQuantity = Math.max(1, currentQuantity + delta);
      return { ...prev, [serviceId]: newQuantity };
    });
  };

  const handleOptionToggle = (optionId: string) => {
    hapticFeedback('light');
    const currentOptions = formData.additionalOptions;
    const newOptions = currentOptions.includes(optionId)
      ? currentOptions.filter(id => id !== optionId)
      : [...currentOptions, optionId];
    handleChange('additionalOptions', newOptions);
  };

  const handleSubmit = useCallback(async () => {
    hapticFeedback('heavy'); // Strong haptic feedback for form submission
    
    const fullFormData: BookingFormData = { ...formData, quantities };
    const validation = validateBookingForm(fullFormData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      notificationFeedback('error');
      tg?.showAlert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    tg?.MainButton.showProgress();

    try {
      const success = await sendBookingToTelegram(fullFormData);
      if (success) {
        notificationFeedback('success');
        tg?.showAlert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.', () => onNavigate('Home'));
      } else {
        throw new Error('Ошибка отправки');
      }
    } catch (error) {
      notificationFeedback('error');
      tg?.showAlert('Произошла ошибка. Попробуйте позже.');
    } finally {
      tg?.MainButton.hideProgress();
    }
  }, [formData, quantities, tg, onNavigate]);

  // Use the local button for submission
  // useEffect(() => {
  //   if (tg) {
  //     tg.MainButton.setText('Отправить заявку');
  //     tg.MainButton.show();
  //     tg.MainButton.onClick(handleSubmit);
  //     return () => {
  //       tg.MainButton.offClick(handleSubmit);
  //       tg.MainButton.hide();
  //     };
  //   }
  // }, [tg, handleSubmit]);
    
  const selectedMainService = mainServices.flatMap(cat => cat.services).find(s => formData.services.includes(s.id));
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen flex flex-col p-6 pt-12 pb-44 bg-black text-white">
      <button 
        onClick={() => onNavigate('Home')} 
        className='flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 active:scale-90 self-start'
      >
        <ArrowLeft className='w-5 h-5' />
        <span className='font-medium'>Назад</span>
      </button>

      <h1 className="text-3xl font-bold mb-8 text-center">Онлайн-запись</h1>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
        {/* Contact Info */}
        <FormSection title="Контактная информация">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-400">Имя *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Как к вам обращаться?"
            />
            {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-400">Телефон *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={`w-full p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.phone ? 'border-red-500' : ''}`}
              placeholder="+7 (999) 123-45-67"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-2">{errors.phone}</p>}
          </div>
        </FormSection>

        {/* Car Info */}
        <FormSection title="Информация об автомобиле">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm font-medium mb-2 text-gray-400">Марка *</label>
              <input
                type="text"
                value={formData.carBrand}
                onChange={(e) => handleChange('carBrand', e.target.value)}
                onFocus={() => {
                  const input = formData.carBrand.toLowerCase();
                  const filtered = input.length > 0 ? allBrands.filter(brand => brand.toLowerCase().includes(input)) : allBrands;
                  setSuggestedBrands(filtered.slice(0, 5));
                  setShowBrandSuggestions(true);
                }}
                onBlur={() => setTimeout(() => setShowBrandSuggestions(false), 200)}
                className={`w-full p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.carBrand ? 'border-red-500' : ''}`}
                placeholder="BMW"
              />
                <div className="absolute z-50 w-full mt-2 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl shadow-lg max-h-48 overflow-y-auto">
                  {suggestedBrands.map((brand) => (
                    <button key={brand} type="button" onClick={() => { handleChange('carBrand', brand); setShowBrandSuggestions(false); }} className="w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-colors">{brand}</button>
                  ))}
                </div>
              )}
              {errors.carBrand && <p className="text-red-500 text-sm mt-2">{errors.carBrand}</p>}
            </div>
            <div className="relative">
              <label className="block text-sm font-medium mb-2 text-gray-400">Модель *</label>
              <input
                type="text"
                value={formData.carModel}
                onChange={(e) => handleChange('carModel', e.target.value)}
                onFocus={() => {
                  if (formData.carBrand) {
                    const models = getModelsByBrand(formData.carBrand);
                    const input = formData.carModel.toLowerCase();
                    const filtered = input.length > 0 ? models.filter(model => model.toLowerCase().includes(input)) : models;
                    setSuggestedModels(filtered.slice(0, 5));
                    setShowModelSuggestions(true);
                  }
                }}
                onBlur={() => setTimeout(() => setShowModelSuggestions(false), 200)}
                disabled={!formData.carBrand}
                className={`w-full p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.carModel ? 'border-red-500' : ''} ${!formData.carBrand ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder={formData.carBrand ? "X5" : "Сначала марку"}
              />
              {showModelSuggestions && suggestedModels.length > 0 && (
                <div className="absolute z-50 w-full mt-2 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl shadow-lg max-h-48 overflow-y-auto">
                  {suggestedModels.map((model) => (
                    <button key={model} type="button" onClick={() => { handleChange('carModel', model); setShowModelSuggestions(false); }} className="w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-colors">{model}</button>
                  ))}
                </div>
              )}
              {errors.carModel && <p className="text-red-500 text-sm mt-2">{errors.carModel}</p>}
            </div>
          </div>
        </FormSection>

        {/* Services Selection */}
        <FormSection title="Выберите услугу *">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Основные комплексы</h4>
            {mainServices.flatMap(cat => cat.services).map(service => (
              <ServiceRadioOption
                key={service.id}
                service={service}
                isSelected={formData.services.includes(service.id)}
                onSelect={() => handleMainServiceChange(service.id)}
              />
            ))}
          </div>

          {(selectedMainService?.id === 'full-cleaning-basic' || selectedMainService?.id === 'pre-sale-prep') && selectedMainService.additionalOptions && (
            <div className="pl-4 border-l-2 border-white/10 space-y-3 pt-4">
               <label className="block text-sm font-medium text-gray-400 mb-2">Дополнительные опции</label>
              {selectedMainService.additionalOptions.map(option => (
                <label key={option.id} className="flex items-center p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-white hover:bg-white/10 cursor-pointer transition-colors">
                  <input type="checkbox" checked={formData.additionalOptions.includes(option.id)} onChange={() => handleOptionToggle(option.id)} className="w-5 h-5 bg-transparent border-2 border-white/30 text-blue-500 focus:ring-0 focus:ring-offset-0 rounded" />
                  <div className="flex-1 flex items-center justify-between ml-4">
                    <div className="flex items-center gap-2">{option.icon && <span>{option.icon}</span>}<span>{option.name}</span></div>
                    <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">+{option.price.toLocaleString('ru-RU')} ₽</span>
                  </div>
                </label>
              ))}
            </div>
          )}
          
          <div className="space-y-4 pt-4">
            <h4 className="text-lg font-semibold text-white">Локальная химчистка</h4>
            <div className="grid grid-cols-1 gap-4">
              {localCleaningServices.flatMap(cat => cat.services).map(service => (
                  <ServiceCheckboxOption
                    key={service.id}
                    service={service}
                    isSelected={formData.services.includes(service.id)}
                    onToggle={() => handleLocalServiceToggle(service.id)}
                    quantity={quantities[service.id] || 1}
                    onQuantityChange={(delta) => handleQuantityChange(service.id, delta)}
                  />
              ))}
            </div>
          </div>
          {errors.services && <p className="text-red-500 text-sm mt-2">{errors.services}</p>}
        </FormSection>
        
        {/* Total Price */}
        {formData.services.length > 0 && (
          <div className="mt-12 p-6 bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-blue-500/50 rounded-3xl shadow-lg">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-white">Итоговая сумма:</span>
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                {totalPrice.toLocaleString('ru-RU')} ₽
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">
              Цена является предварительной. Менеджер свяжется с вами для подтверждения итоговой стоимости.
            </p>
          </div>
        )}

        {/* Date & Comments */}
        <FormSection title="Дата и пожелания">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-400">Желаемая дата *</label>
              <input
                type="date"
                value={formData.date}
                min={today}
                onChange={(e) => handleChange('date', e.target.value)}
                className={`w-full p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.date ? 'border-red-500' : ''}`}
              />
              {errors.date && <p className="text-red-500 text-sm mt-2">{errors.date}</p>}
            </div>
            <div className="flex items-center justify-start h-full pt-8">
              <p className="text-gray-400 text-sm">Менеджер свяжется с вами для уточнения удобного времени.</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-400">Комментарий</label>
            <textarea
              value={formData.comment}
              onChange={(e) => handleChange('comment', e.target.value)}
              rows={3}
              className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              placeholder="Есть особые пожелания?"
            />
          </div>
        </FormSection>
      </form>

      <div className="mt-8">
        <button 
          type="submit" 
          onClick={handleSubmit}
          className='w-full h-14 bg-gradient-to-r from-[#4c6ef5] to-[#9d4edd] text-white font-bold uppercase text-sm rounded-xl shadow-[0_0_20px_rgba(157,78,221,0.5)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 active:scale-90'
        >
          Отправить заявку
        </button>
      </div>
    </div>
  );
};

export default Booking;