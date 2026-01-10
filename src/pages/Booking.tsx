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

// New component for structuring form sections
const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-glass/50 backdrop-blur-xl border border-glass-border rounded-2xl p-6 shadow-lg">
    <h3 className="text-xl font-bold text-accent-primary pb-4 mb-6 border-b border-glass-border">{title}</h3>
    <div className="space-y-6">
      {children}
    </div>
  </div>
);

// Компонент для отображения опции выбора основной услуги (радио-кнопка)
const ServiceRadioOption: React.FC<{
  service: Service;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ service, isSelected, onSelect }) => (
  <div
    onClick={onSelect}
    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300
      ${isSelected 
        ? 'bg-gradient-to-br from-accent-primary/20 to-bg-dark-secondary border-glass-border-selected shadow-glow-sm scale-105' 
        : 'bg-glass border-glass-border hover:border-accent-primary/50 opacity-70 hover:opacity-100'
      }
    `}
  >
    <div className="flex items-center">
      <div className={`w-6 h-6 flex-shrink-0 border-2 rounded-full flex items-center justify-center mr-4 ${isSelected ? 'border-accent-primary' : 'border-glass-border'}`}>
        {isSelected && <div className="w-3 h-3 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary" />}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {service.icon && <span className="text-xl">{service.icon}</span>}
            <span className="font-medium text-text-primary">{service.name}</span>
          </div>
          <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-accent-primary to-accent-secondary">
            {service.price.toLocaleString('ru-RU')} ₽
          </span>
        </div>
        {service.description && <p className="text-sm text-text-secondary mt-1" dangerouslySetInnerHTML={{ __html: service.description.replace(/\n/g, '<br />') }}></p>}
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
  <div
    onClick={onToggle}
    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300
      ${isSelected 
        ? 'bg-gradient-to-br from-accent-primary/20 to-bg-dark-secondary border-glass-border-selected shadow-glow-sm scale-105' 
        : 'bg-glass border-glass-border hover:border-accent-primary/50 opacity-70 hover:opacity-100'
      }
    `}
  >
    <div className="flex items-start">
      <div className={`w-6 h-6 flex-shrink-0 border-2 rounded-lg mt-1 flex items-center justify-center mr-4 ${isSelected ? 'border-accent-primary' : 'border-glass-border'}`}>
        {isSelected && <div className="w-3 h-3 rounded-md bg-gradient-to-br from-accent-primary to-accent-secondary" />}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {service.icon && <span className="text-xl">{service.icon}</span>}
            <span className="font-medium text-text-primary">{service.name}</span>
            {service.unitLabel && <span className="text-sm text-text-secondary">{service.unitLabel}</span>}
          </div>
          <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-accent-primary to-accent-secondary">
            {service.price.toLocaleString('ru-RU')} ₽
          </span>
        </div>
        {service.description && <p className="text-sm text-text-secondary mt-1" dangerouslySetInnerHTML={{ __html: service.description.replace(/\n/g, '<br />') }}></p>}
      </div>
    </div>
    {service.needsQuantity && isSelected && (
      <div className="mt-4 flex items-center justify-center gap-4">
        <button 
          type="button" 
          onClick={(e) => { e.stopPropagation(); onQuantityChange(-1); }} 
          className="w-10 h-10 rounded-full bg-glass border border-glass-border text-text-primary text-xl font-bold hover:border-accent-secondary active:scale-95"
        >
          -
        </button>
        <span className="text-xl font-semibold w-10 text-center text-text-primary">{quantity}</span>
        <button 
          type="button" 
          onClick={(e) => { e.stopPropagation(); onQuantityChange(1); }} 
          className="w-10 h-10 rounded-full bg-glass border border-glass-border text-text-primary text-xl font-bold hover:border-accent-primary active:scale-95"
        >
          +
        </button>
      </div>
    )}
  </div>
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
    <div className="min-h-screen px-4 py-8 pb-32 fade-in">
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-text-primary">Онлайн-запись</h2>

        <div className="space-y-8">
          <FormSection title="Контактная информация">
            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">Имя *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full bg-transparent border-0 border-b-2 px-1 py-2 text-text-primary focus:ring-0 focus:border-accent-primary transition-all duration-300 ${
                  errors.name ? 'border-red-500' : 'border-glass-border'
                }`}
                placeholder="Как к вам обращаться?"
              />
              {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">Телефон *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={`w-full bg-transparent border-0 border-b-2 px-1 py-2 text-text-primary focus:ring-0 focus:border-accent-primary transition-all duration-300 ${
                  errors.phone ? 'border-red-500' : 'border-glass-border'
                }`}
                placeholder="+7 (999) 123-45-67"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-2">{errors.phone}</p>}
            </div>
          </FormSection>

          <FormSection title="Информация об автомобиле">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="relative">
                <label className="block text-sm font-medium mb-2 text-text-secondary">Марка *</label>
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
                  className={`w-full bg-transparent border-0 border-b-2 px-1 py-2 text-text-primary focus:ring-0 focus:border-accent-primary transition-all duration-300 ${
                    errors.carBrand ? 'border-red-500' : 'border-glass-border'
                  }`}
                  placeholder="BMW"
                />
                {showBrandSuggestions && suggestedBrands.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-glass backdrop-blur-xl border border-glass-border rounded-lg shadow-glow-sm max-h-48 overflow-y-auto">
                    {suggestedBrands.map((brand) => (
                      <button key={brand} type="button" onClick={() => { handleChange('carBrand', brand); setShowBrandSuggestions(false); }} className="w-full text-left px-4 py-3 hover:bg-accent-primary/20 transition-colors">{brand}</button>
                    ))}
                  </div>
                )}
                {errors.carBrand && <p className="text-red-500 text-sm mt-2">{errors.carBrand}</p>}
              </div>
              <div className="relative">
                <label className="block text-sm font-medium mb-2 text-text-secondary">Модель *</label>
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
                  className={`w-full bg-transparent border-0 border-b-2 px-1 py-2 text-text-primary focus:ring-0 focus:border-accent-primary transition-all duration-300 ${errors.carModel ? 'border-red-500' : 'border-glass-border'} ${!formData.carBrand ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder={formData.carBrand ? "X5" : "Сначала марку"}
                />
                {showModelSuggestions && suggestedModels.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-glass backdrop-blur-xl border border-glass-border rounded-lg shadow-glow-sm max-h-48 overflow-y-auto">
                    {suggestedModels.map((model) => (
                      <button key={model} type="button" onClick={() => { handleChange('carModel', model); setShowModelSuggestions(false); }} className="w-full text-left px-4 py-3 hover:bg-accent-primary/20 transition-colors">{model}</button>
                    ))}
                  </div>
                )}
                {errors.carModel && <p className="text-red-500 text-sm mt-2">{errors.carModel}</p>}
              </div>
            </div>
          </FormSection>

          <FormSection title="Выберите услугу *">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-text-primary">Основные комплексы</h4>
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
              <div className="pl-4 border-l-2 border-glass-border space-y-3 pt-4">
                 <label className="block text-sm font-medium text-text-secondary">Дополнительные опции</label>
                {selectedMainService.additionalOptions.map(option => (
                  <label key={option.id} className="flex items-center p-3 rounded-lg border bg-glass/80 border-glass-border hover:border-accent-primary/50 cursor-pointer">
                    <input type="checkbox" checked={formData.additionalOptions.includes(option.id)} onChange={() => handleOptionToggle(option.id)} className="w-5 h-5 bg-transparent border-2 border-glass-border-selected text-accent-primary focus:ring-0 focus:ring-offset-0 rounded" />
                    <div className="flex-1 flex items-center justify-between ml-4">
                      <div className="flex items-center gap-2">{option.icon && <span>{option.icon}</span>}<span>{option.name}</span></div>
                      <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-accent-primary to-accent-secondary">+{option.price.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </label>
                ))}
              </div>
            )}
            
            <div className="space-y-4 pt-4">
              <h4 className="text-lg font-semibold text-text-primary">Локальная химчистка</h4>
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
          
          {formData.services.length > 0 && (
            <div className="mt-12 p-6 bg-gradient-to-br from-accent-primary/20 to-bg-dark-secondary backdrop-blur-xl border border-glass-border-selected rounded-2xl shadow-glow">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold text-text-primary">Итоговая сумма:</span>
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-primary to-accent-secondary">
                  {totalPrice.toLocaleString('ru-RU')} ₽
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-3 text-center">
                Цена является предварительной. Менеджер свяжется с вами для подтверждения итоговой стоимости.
              </p>
            </div>
          )}

          <FormSection title="Дата и пожелания">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium mb-2 text-text-secondary">Желаемая дата *</label>
                <input
                  type="date"
                  value={formData.date}
                  min={today}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className={`w-full bg-transparent border-0 border-b-2 px-1 py-2 text-text-primary focus:ring-0 focus:border-accent-primary transition-all duration-300 ${
                    errors.date ? 'border-red-500' : 'border-glass-border'
                  }`}
                />
                {errors.date && <p className="text-red-500 text-sm mt-2">{errors.date}</p>}
              </div>
              <div className="flex items-center justify-start h-full pt-8">
                <p className="text-text-secondary text-sm">Менеджер свяжется с вами для уточнения удобного времени.</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">Комментарий</label>
              <textarea
                value={formData.comment}
                onChange={(e) => handleChange('comment', e.target.value)}
                rows={3}
                className="w-full bg-transparent border-0 border-b-2 px-1 py-2 text-text-primary focus:ring-0 focus:border-accent-primary transition-all duration-300 resize-none border-glass-border"
                placeholder="Есть особые пожелания?"
              />
            </div>
          </FormSection>
        </div>
      </div>
    </div>
  );
};

export default Booking;
