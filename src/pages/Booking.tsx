import { useState, useEffect, useCallback, useMemo } from 'react';
import { getTelegramUser, hapticFeedback, notificationFeedback } from '../utils/telegram';
import { sendBookingToTelegram, validateBookingForm, type BookingFormData } from '../utils/booking';
import { mainServices, localCleaningServices, getServiceById, getServiceOptionById } from '../data/services';
import { getTelegramWebApp } from '../utils/telegram';
import { getAllBrands, getModelsByBrand } from '../data/carBrands';
import { PageKey } from '../App';
import type { Service } from '../types/services';

interface BookingProps {
  onNavigate: (pageKey: PageKey) => void;
}

// Компонент для отображения опции выбора основной услуги (радио-кнопка)
const ServiceRadioOption: React.FC<{
  service: Service;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ service, isSelected, onSelect }) => (
  <div
    onClick={onSelect}
    className={`block p-4 rounded-lg border cursor-pointer transition-all ${
      isSelected
        ? 'bg-primary/20 border-primary'
        : 'bg-dark-secondary border-dark-tertiary hover:border-primary/50'
    }`}
  >
    <div className="flex items-center">
      <div className="w-5 h-5 flex-shrink-0 border-2 rounded-full flex items-center justify-center mr-3 border-primary">
        {isSelected && <div className="w-3 h-3 rounded-full bg-primary" />}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {service.icon && <span>{service.icon}</span>}
            <span className="font-medium">{service.name}</span>
          </div>
          <span className="text-primary font-semibold">
            {service.price.toLocaleString('ru-RU')} ₽
          </span>
        </div>
        {service.description && <p className="text-sm text-gray-400 mt-1" dangerouslySetInnerHTML={{ __html: service.description.replace(/\n/g, '<br />') }}></p>}
      </div>
    </div>
  </div>
);

// Компонент для отображения опции выбора локальной услуги (чекбокс)
const ServiceCheckboxOption: React.FC<{
  service: Service;
  isSelected: boolean;
  onToggle: () => void;
  quantity: number;
  onQuantityChange: (delta: number) => void;
}> = ({ service, isSelected, onToggle, quantity, onQuantityChange }) => (
  <label
    className={`block p-4 rounded-lg border cursor-pointer transition-all ${
      isSelected
        ? 'bg-primary/20 border-primary backdrop-filter backdrop-blur-sm'
        : 'bg-dark-secondary border-dark-tertiary hover:border-primary/50'
    }`}
  >
    <div className="flex items-center">
      <input
        type="checkbox"
        name="service"
        value={service.id}
        checked={isSelected}
        onChange={onToggle}
        className="w-5 h-5 text-primary focus:ring-primary rounded"
      />
      <div className="flex-1 ml-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {service.icon && <span>{service.icon}</span>}
            <span className="font-medium">{service.name}</span>
            {service.unitLabel && <span className="text-sm text-gray-400">{service.unitLabel}</span>}
          </div>
          <span className="text-primary font-semibold">
            {service.price.toLocaleString('ru-RU')} ₽
          </span>
        </div>
        {service.description && <p className="text-sm text-gray-400 mt-1" dangerouslySetInnerHTML={{ __html: service.description.replace(/\n/g, '<br />') }}></p>}
      </div>
    </div>
    {service.needsQuantity && isSelected && (
      <div className="mt-3 flex items-center justify-center gap-4">
        <button type="button" onClick={(e) => { e.preventDefault(); onQuantityChange(-1); }} className="w-8 h-8 rounded-full bg-dark-tertiary text-white text-lg">-</button>
        <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
        <button type="button" onClick={(e) => { e.preventDefault(); onQuantityChange(1); }} className="w-8 h-8 rounded-full bg-dark-tertiary text-white text-lg">+</button>
      </div>
    )}
  </label>
);

const Booking: React.FC<BookingProps> = ({ onNavigate }) => {
  const tg = getTelegramWebApp();
  const telegramUser = getTelegramUser();

  const [formData, setFormData] = useState<Omit<BookingFormData, 'quantities'>>({
    name: telegramUser?.first_name || '',
    phone: '+7',
    carBrand: '',
    carModel: '',
    services: [], // Изменено на массив
    additionalOptions: [],
    date: '',
    time: '',
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
    if (formData.carBrand) {
      setFormData(prev => {
        if (prev.carModel && !getModelsByBrand(prev.carBrand).includes(prev.carModel)) {
          return { ...prev, carModel: '' };
        }
        return prev;
      });
    }
  }, [formData.carBrand]);
    
  const handleChange = (field: keyof Omit<BookingFormData, 'quantities'>, value: any) => {
    const isCarBrandChange = field === 'carBrand';
    const newBrand = isCarBrandChange ? (value as string) : formData.carBrand;

    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      if (isCarBrandChange && prev.carBrand !== value) {
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

    if (isCarBrandChange && typeof value === 'string') {
      const input = value.toLowerCase();
      if (input.length > 0) {
        const filtered = allBrands.filter(brand => brand.toLowerCase().includes(input)).slice(0, 5);
        setSuggestedBrands(filtered);
        setShowBrandSuggestions(true);
      } else {
        setSuggestedBrands([]);
        setShowBrandSuggestions(false);
      }
    }

    if (field === 'carModel' && typeof value === 'string') {
      const models = getModelsByBrand(newBrand);
      const input = value.toLowerCase();
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
    hapticFeedback('medium');
    
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

  useEffect(() => {
    if (tg) {
      tg.MainButton.setText('Отправить заявку');
      tg.MainButton.show();
      tg.MainButton.onClick(handleSubmit);
      return () => {
        tg.MainButton.offClick(handleSubmit);
        tg.MainButton.hide();
      };
    }
  }, [tg, handleSubmit]);
    
  const selectedMainService = mainServices.flatMap(cat => cat.services).find(s => formData.services.includes(s.id));
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-dark px-4 py-6 pb-24 fade-in">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Онлайн-запись</h2>

        <div className="space-y-5">
          {/* Имя */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Имя *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full bg-dark-secondary border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.name ? 'border-red-500' : 'border-dark-tertiary'
              }`}
              placeholder="Ваше имя"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Телефон */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Телефон *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={`w-full bg-dark-secondary border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.phone ? 'border-red-500' : 'border-dark-tertiary'
              }`}
              placeholder="+7 (999) 123-45-67"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* Марка и модель авто */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Марка */}
            <div className="relative">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Марка *
              </label>
              <input
                type="text"
                value={formData.carBrand}
                onChange={(e) => handleChange('carBrand', e.target.value)}
                onFocus={() => {
                  const input = formData.carBrand.toLowerCase();
                  const filtered = input.length > 0
                    ? allBrands.filter(brand => brand.toLowerCase().includes(input))
                    : allBrands;
                  setSuggestedBrands(filtered.slice(0, 5));
                  setShowBrandSuggestions(true);
                }}
                onBlur={() => setTimeout(() => setShowBrandSuggestions(false), 200)}
                className={`w-full bg-dark-secondary border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.carBrand ? 'border-red-500' : 'border-dark-tertiary'
                }`}
                placeholder="BMW"
              />
              {showBrandSuggestions && suggestedBrands.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-dark-secondary border border-dark-tertiary rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {suggestedBrands.map((brand) => (
                    <button key={brand} type="button" onClick={() => { handleChange('carBrand', brand); setShowBrandSuggestions(false); }} className="w-full text-left px-4 py-2 hover:bg-dark-tertiary transition-colors">{brand}</button>
                  ))}
                </div>
              )}
              {errors.carBrand && <p className="text-red-500 text-sm mt-1">{errors.carBrand}</p>}
            </div>
            {/* Модель */}
            <div className="relative">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Модель *
              </label>
              <input
                type="text"
                value={formData.carModel}
                onChange={(e) => handleChange('carModel', e.target.value)}
                onFocus={() => {
                  if (formData.carBrand) {
                    const models = getModelsByBrand(formData.carBrand);
                    const input = formData.carModel.toLowerCase();
                    const filtered = input.length > 0
                      ? models.filter(model => model.toLowerCase().includes(input))
                      : models;
                    setSuggestedModels(filtered.slice(0, 5));
                    setShowModelSuggestions(true);
                  }
                }}
                onBlur={() => setTimeout(() => setShowModelSuggestions(false), 200)}
                disabled={!formData.carBrand}
                className={`w-full bg-dark-secondary border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary ${errors.carModel ? 'border-red-500' : 'border-dark-tertiary'} ${!formData.carBrand ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder={formData.carBrand ? "X5" : "Сначала марку"}
              />
              {showModelSuggestions && suggestedModels.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-dark-secondary border border-dark-tertiary rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {suggestedModels.map((model) => (
                    <button key={model} type="button" onClick={() => { handleChange('carModel', model); setShowModelSuggestions(false); }} className="w-full text-left px-4 py-2 hover:bg-dark-tertiary transition-colors">{model}</button>
                  ))}
                </div>
              )}
              {errors.carModel && <p className="text-red-500 text-sm mt-1">{errors.carModel}</p>}
            </div>
          </div>
          
          {/* Выбор услуги */}
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-300">Услуга *</label>
            
            {/* Основные услуги */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-primary border-b-2 border-primary/50 pb-2">Основные комплексы</h4>
              {mainServices.flatMap(cat => cat.services).map(service => (
                <ServiceRadioOption
                  key={service.id}
                  service={service}
                  isSelected={formData.services.includes(service.id)}
                  onSelect={() => handleMainServiceChange(service.id)}
                />
              ))}
            </div>

            {/* Доп. опции для полной химчистки */}
            {selectedMainService?.id === 'full-cleaning-basic' && selectedMainService.additionalOptions && (
              <div className="mt-4 pl-5 space-y-2">
                 <label className="block text-sm font-medium mb-2 text-gray-300">Дополнительно к полной химчистке</label>
                {selectedMainService.additionalOptions.map(option => (
                  <label key={option.id} className="flex items-center p-3 rounded-lg border bg-dark-secondary border-dark-tertiary hover:border-primary/50 cursor-pointer">
                    <input type="checkbox" checked={formData.additionalOptions.includes(option.id)} onChange={() => handleOptionToggle(option.id)} className="mr-3 w-5 h-5 text-primary focus:ring-primary rounded" />
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">{option.icon && <span>{option.icon}</span>}<span>{option.name}</span></div>
                      <span className="text-primary font-semibold">+{option.price.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {/* Доп. опции для предпродажной подготовки */}
            {selectedMainService?.id === 'pre-sale-prep' && selectedMainService.additionalOptions && (
              <div className="mt-4 pl-5 space-y-2">
                 <label className="block text-sm font-medium mb-2 text-gray-300">Дополнительно к предпродажной подготовке</label>
                {selectedMainService.additionalOptions.map(option => (
                  <label key={option.id} className="flex items-center p-3 rounded-lg border bg-dark-secondary border-dark-tertiary hover:border-primary/50 cursor-pointer">
                    <input type="checkbox" checked={formData.additionalOptions.includes(option.id)} onChange={() => handleOptionToggle(option.id)} className="mr-3 w-5 h-5 text-primary focus:ring-primary rounded" />
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">{option.icon && <span>{option.icon}</span>}<span>{option.name}</span></div>
                      <span className="text-primary font-semibold">+{option.price.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </label>
                ))}
              </div>
            )}
            
            {/* Локальная химчистка */}
            <div className="mt-6 space-y-3">
              <h4 className="text-lg font-semibold text-gray-300 border-b border-gray-600 pb-2">Локальная химчистка</h4>
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
            {errors.services && <p className="text-red-500 text-sm mt-1">{errors.services}</p>}
          </div>

          {/* Итоговая стоимость */}
          {formData.services.length > 0 && (
            <div className="mt-6 pt-4 border-t border-dark-tertiary">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Итоговая сумма:</span>
                <span className="text-2xl font-bold text-primary">
                  {totalPrice.toLocaleString('ru-RU')} ₽
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Цена может изменяться. Для определения итоговой суммы необходимо связаться с менеджером.
              </p>
            </div>
          )}

          {/* Дата и время */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Дата *
              </label>
              <input
                type="date"
                value={formData.date}
                min={today}
                onChange={(e) => handleChange('date', e.target.value)}
                className={`w-full bg-dark-secondary border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.date ? 'border-red-500' : 'border-dark-tertiary'
                }`}
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>
            <div className="flex items-center justify-start h-full pt-8">
              <p className="text-gray-400 text-sm">С вами после заполнения формы свяжется менеджер и уточнит удобное для вас время.</p>
            </div>
          </div>

          {/* Комментарий */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Комментарий
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => handleChange('comment', e.target.value)}
              rows={3}
              className="w-full bg-dark-secondary border border-dark-tertiary rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Есть пожелания?"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
