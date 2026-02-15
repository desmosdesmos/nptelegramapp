import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { PageKey } from '../App';
import { getTelegramWebApp, hapticFeedback, notificationFeedback, getTelegramUser } from '../utils/telegram';
import { sendBookingToTelegram, validateBookingForm, type BookingFormData } from '../utils/booking';
import { incrementBookedReferrals, getReferralCodeFromUrl, isValidReferralCode } from '../utils/simpleReferralSystem';
import { getServiceById, mainServices, localCleaningServices } from '../data/services';
import { getAllBrands, getModelsByBrand } from '../data/carBrands';
import type { Service } from '../types/services';
import { ServiceIcon } from '../utils/iconMapper';

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
    type="button"
    onClick={onSelect}
    className={`w-full p-3 sm:p-4 rounded-2xl border transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 active:scale-90 text-left
      ${isSelected
        ? 'bg-blue-600/20 border-blue-500/50 shadow-lg'
        : 'bg-white/5 border-white/10 hover:border-blue-500/20'
      }
    `}
  >
    <div className="flex w-full items-center">
      <div className={`w-4 h-4 flex-shrink-0 border-2 rounded-full flex items-center justify-center mr-3 sm:mr-4 ${isSelected ? 'border-blue-500' : 'border-white/30'}`}>
        {isSelected && <div className="w-2 h-2 rounded-full bg-blue-500 shadow-blue-500/50" />}
      </div>
      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center">
        <div className="flex items-center flex-1 min-w-0 mb-1 sm:mb-0 sm:mr-2">
          <ServiceIcon title={service.name} isSelected={isSelected} size="sm" />
          <span className="font-medium text-white break-words flex-1 min-w-0 ml-2">{service.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-base sm:text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 whitespace-nowrap flex-shrink-0 text-right">
            {service.price.toLocaleString('ru-RU')}<span className="whitespace-nowrap">&nbsp;₽</span>
          </span>
        </div>
      </div>
    </div>
    {service.description && <p className="text-xs sm:text-sm text-gray-400 mt-1 pl-7 sm:pl-8" dangerouslySetInnerHTML={{ __html: service.description.replace(/\n/g, '<br />') }}></p>}
  </button>
);

// Re-defining ServiceCheckboxOption with glass style and animations
const ServiceCheckboxOption: React.FC<{
  service: Service;
  isSelected: boolean;
  onToggle: () => void;
  quantity: number;
  onQuantityChange: (delta: number) => void;
}> = ({ service, isSelected, onToggle, quantity, onQuantityChange }) => {
  const needsQuantityControl = service.id === 'seat' || service.id === 'door-cards';
  const showQuantityControl = needsQuantityControl && isSelected;

  return (
    <div
      className={`w-full p-3 sm:p-4 rounded-2xl border transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        ${isSelected
          ? 'bg-blue-600/20 border-blue-500/50 shadow-lg'
          : 'bg-white/5 border-white/10'
        }
      `}
    >
      <div className="flex w-full items-center">
        <button
          type="button"
          onClick={onToggle}
          className="flex-1 flex items-start text-left hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
          <div className={`w-4 h-4 flex-shrink-0 border-2 rounded-md mt-1 flex items-center justify-center mr-3 sm:mr-4 ${isSelected ? 'border-blue-500' : 'border-white/30'}`}>
            {isSelected && <div className="w-2 h-2 rounded-sm bg-blue-500 shadow-blue-500/50" />}
          </div>

          <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 flex-1 min-w-0 mb-1 sm:mb-0 sm:mr-2">
              <ServiceIcon title={service.name} isSelected={isSelected} size="sm" />
              <div className="flex flex-col min-w-0">
                <div className="flex items-center">
                  <span className="font-medium text-white break-words flex-1 min-w-0">
                    {service.name}
                  </span>
                  {service.unitLabel && <span className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap ml-1 flex-shrink-0">{service.unitLabel}</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              {showQuantityControl ? (
                <div className="flex flex-col items-end gap-1 sm:gap-2 flex-shrink-0">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); hapticFeedback('light'); onQuantityChange(-1); }}
                      className="min-w-[36px] min-h-[36px] w-9 h-9 sm:min-w-[44px] sm:min-h-[44px] sm:w-11 sm:h-11 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-lg sm:text-xl font-bold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 active:scale-90 flex items-center justify-center shadow-lg"
                    >
                      -
                    </button>
                    <span className="text-base sm:text-xl font-semibold min-w-[24px] sm:min-w-[32px] text-center text-white">{quantity}</span>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); hapticFeedback('light'); onQuantityChange(1); }}
                      className="min-w-[36px] min-h-[36px] w-9 h-9 sm:min-w-[44px] sm:min-h-[44px] sm:w-11 sm:h-11 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-lg sm:text-xl font-bold transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 active:scale-90 flex items-center justify-center shadow-lg"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm sm:text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 whitespace-nowrap flex-shrink-0 text-right">
                    {(service.price * quantity).toLocaleString('ru-RU')}<span className="whitespace-nowrap">&nbsp;₽</span>
                  </span>
                </div>
              ) : (
                <span className="text-sm sm:text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 whitespace-nowrap flex-shrink-0 text-right">
                  {service.price.toLocaleString('ru-RU')}<span className="whitespace-nowrap">&nbsp;₽</span>
                </span>
              )}
            </div>
          </div>
        </button>
      </div>
      {service.description && <p className="text-xs sm:text-sm text-gray-400 mt-1 pl-7 sm:pl-8" dangerouslySetInnerHTML={{ __html: service.description.replace(/\n/g, '<br />') }}></p>}
    </div>
  );
};


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
    referrer: undefined,
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
      const mainService = getServiceById(mainServiceId);
      if (mainService && mainService.additionalOptions) {
        formData.additionalOptions.forEach(optionId => {
          const option = mainService.additionalOptions?.find(opt => opt.id === optionId);
          if (option) {
            total += option.price;
          }
        });
      }
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
        tg.MainButton.hide(); // Keep it hidden when component unmounts to prevent showing in other sections
      }
    };
  }, [tg]);

  // Проверяем реферальный код при загрузке компонента
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log('URL параметры:', Object.fromEntries(urlParams));
    const referralCode = getReferralCodeFromUrl();
    console.log('Извлеченный реферальный код:', referralCode);

    if (referralCode && isValidReferralCode(referralCode)) {
      setFormData(prev => ({
        ...prev,
        referrer: referralCode
      }));
    } else {
      console.log('Реферальный код не найден или невалиден');
    }
  }, []);
    
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

    // Specifically handle services field to clear its error when updated
    if (field === 'services') {
      // Clear services error if there are now services selected
      if (Array.isArray(processedValue) && processedValue.length > 0 && errors.services) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.services;
          return newErrors;
        });
      }
    }

    if (isCarBrandChange && typeof processedValue === 'string') {
      const input = processedValue.toLowerCase();
      const filtered = input.length > 0 
        ? allBrands.filter(brand => brand.toLowerCase().includes(input))
        : allBrands;
      setSuggestedBrands(filtered);
      setShowBrandSuggestions(true);
    }

    if (field === 'carModel' && typeof processedValue === 'string') {
      const models = getModelsByBrand(newBrand);
      const input = processedValue.toLowerCase();
      const filtered = input.length > 0 
        ? models.filter(model => model.toLowerCase().includes(input))
        : models;
      setSuggestedModels(filtered);
      setShowModelSuggestions(true);
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

    // Set initial quantity to 1 for seat and door-cards when selected
    const needsQuantityControl = serviceId === 'seat' || serviceId === 'door-cards';
    if (needsQuantityControl && !isCurrentlySelected && !quantities[serviceId]) {
      setQuantities(prev => ({ ...prev, [serviceId]: 1 }));
    } else if (isCurrentlySelected && needsQuantityControl) {
      // Remove quantity when deselected
      setQuantities(prev => {
        const newQuantities = { ...prev };
        delete newQuantities[serviceId];
        return newQuantities;
      });
    }

  };

  const handleQuantityChange = (serviceId: string, delta: number) => {
    hapticFeedback('light');
    
    const currentQuantity = quantities[serviceId] || 1;
    const newQuantity = Math.max(0, currentQuantity + delta);
    
    if (newQuantity === 0) {
      // Remove service from selection when quantity reaches 0
      const newServices = formData.services.filter(id => id !== serviceId);
      handleChange('services', newServices);
      // Remove quantity entry
      setQuantities(prev => {
        const newQuantities = { ...prev };
        delete newQuantities[serviceId];
        return newQuantities;
      });
    } else {
      // Update quantity
      setQuantities(prev => ({ ...prev, [serviceId]: newQuantity }));
    }
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
      return;
    }

    tg?.MainButton.showProgress();

    try {
      const success = await sendBookingToTelegram(fullFormData);
      if (success) {
        notificationFeedback('success');
        tg?.showAlert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');

        // Если пользователь пришел по реферальной ссылке, увеличиваем счетчик "Записалось"
        if (formData.referrer) {
          // Увеличиваем счетчик "Записалось" с помощью новой системы
          incrementBookedReferrals();

          console.log(`Заявка от реферала: ${formData.referrer}. Увеличиваем счетчик "Записалось".`);
        }
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

      {/* Отображение информации о реферере */}
      {formData.referrer && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-2 text-white">
            <span className="text-lg">🎁</span>
            <p className="text-sm">
              Вы перешли по ссылке пользователя <span className="font-semibold">{formData.referrer}</span>
            </p>
          </div>
        </div>
      )}

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
        <div className={`relative ${showBrandSuggestions || showModelSuggestions ? 'z-50' : 'z-30'}`}>
          <FormSection title="Информация об автомобиле">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-medium mb-2 text-gray-400">Марка *</label>
                <input
                  type="text"
                  value={formData.carBrand}
                  onChange={(e) => handleChange('carBrand', e.target.value)}
                  onFocus={() => {
                    setSuggestedBrands(allBrands);
                    setShowBrandSuggestions(true);
                  }}
                  onBlur={() => setTimeout(() => setShowBrandSuggestions(false), 200)}
                  className={`w-full p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.carBrand ? 'border-red-500' : ''}`}
                  placeholder="BMW"
                />
                {showBrandSuggestions && suggestedBrands.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-[100] mt-2 rounded-3xl bg-zinc-900/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-h-56 overflow-y-auto p-2">
                    <div className="flex flex-col">
                      {suggestedBrands.map((brand) => (
                        <button 
                          key={brand} 
                          type="button" 
                          onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleChange('carBrand', brand); setShowBrandSuggestions(false); }} 
                          className="w-full text-left px-4 py-3 text-white hover:bg-white/10 active:bg-white/20 transition-all duration-200 font-medium rounded-2xl"
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
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
                      setSuggestedModels(models);
                      setShowModelSuggestions(true);
                    }
                  }}
                  onBlur={() => setTimeout(() => setShowModelSuggestions(false), 200)}
                  disabled={!formData.carBrand}
                  className={`w-full p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.carModel ? 'border-red-500' : ''} ${!formData.carBrand ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder={formData.carBrand ? "X5" : "Сначала марку"}
                />
                {showModelSuggestions && suggestedModels.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-[100] mt-2 rounded-3xl bg-zinc-900/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-h-56 overflow-y-auto p-2">
                    <div className="flex flex-col">
                      {suggestedModels.map((model) => (
                        <button 
                          key={model} 
                          type="button" 
                          onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleChange('carModel', model); setShowModelSuggestions(false); }} 
                          className="w-full text-left px-4 py-3 text-white hover:bg-white/10 active:bg-white/20 transition-all duration-200 font-medium rounded-2xl"
                        >
                          {model}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {errors.carModel && <p className="text-red-500 text-sm mt-2">{errors.carModel}</p>}
              </div>
            </div>
          </FormSection>
        </div>

        {/* Services Selection */}
        <div className="relative z-20">
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
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      hapticFeedback('light');
                      handleOptionToggle(option.id);
                    }}
                    className={`flex items-center p-3 rounded-2xl border border-white/10 backdrop-blur-xl text-white transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 active:scale-90 w-full
                      ${formData.additionalOptions.includes(option.id)
                        ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/50 shadow-lg'
                        : 'bg-white/5 hover:bg-white/10'}`}
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.additionalOptions.includes(option.id)}
                        readOnly
                        className="w-5 h-5 appearance-none border-2 rounded-md flex items-center justify-center
                          checked:bg-gradient-to-br checked:from-blue-500 checked:to-purple-500 checked:border-transparent"
                        style={{ borderColor: formData.additionalOptions.includes(option.id) ? 'transparent' : 'rgba(255,255,255,0.3)' }}
                      />
                      {formData.additionalOptions.includes(option.id) && (
                        <svg className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 flex items-center justify-between ml-4 w-full">
                      <div className="flex items-center gap-2 flex-1 pr-4 min-w-0">
                        <ServiceIcon title={option.name} size="sm" />
                        <span className="truncate">{option.name}</span>
                      </div>
                      <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 whitespace-nowrap flex-shrink-0 text-right">+{option.price.toLocaleString('ru-RU')}&nbsp;₽</span>
                    </div>
                  </button>
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
          </FormSection>
        </div>
        
        {/* Total Price */}
        {formData.services.length > 0 && (
          <div className="mt-12 p-6 bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-blue-500/50 rounded-3xl shadow-lg relative z-10">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-white flex-1 pr-4 min-w-0">Итоговая сумма:</span>
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 whitespace-nowrap flex-shrink-0">
                {totalPrice.toLocaleString('ru-RU')}&nbsp;₽
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">
              Цена является предварительной. Менеджер свяжется с вами для подтверждения итоговой стоимости.
            </p>
          </div>
        )}

        {/* Date & Comments */}
        <div className="relative z-0">
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
        </div>
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