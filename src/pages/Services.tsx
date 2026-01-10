import { hapticFeedback } from '../utils/telegram';
import { PageKey } from '../App';
import { mainServices, localCleaningServices } from '../data/services';
import type { Service } from '../types/services';

interface ServicesProps {
  onNavigate: (pageKey: PageKey) => void;
}

// Компонент для отображения одной услуги
const ServiceItem: React.FC<{ service: Service }> = ({ service }) => (
  <div className="flex items-center justify-between p-3 bg-dark rounded-lg">
    <div className="flex items-center gap-2">
      {service.icon && <span>{service.icon}</span>}
      <span>{service.name}</span>
      {service.unitLabel && <span className="text-sm text-gray-400">{service.unitLabel}</span>}
    </div>
    <span className="text-primary font-semibold">
      {service.price.toLocaleString('ru-RU')} ₽
    </span>
  </div>
);

const Services: React.FC<ServicesProps> = ({ onNavigate }) => {

  const handleBooking = () => {
    hapticFeedback('light');
    onNavigate('Booking');
  };

  return (
    <div className="min-h-screen bg-dark px-4 py-6 pb-24 fade-in">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Услуги и цены</h2>

        {/* Основные услуги */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center text-primary border-b-2 border-primary/50 pb-2 mb-4">
            Основные комплексы
          </h3>
          {mainServices.map(category =>
            category.services.map(service => (
              <div key={service.id} className="bg-dark-secondary rounded-xl p-6 border-2 border-primary/50 shadow-lg">
                <h4 className="text-xl font-semibold mb-3 flex items-center gap-3">
                  {service.icon} {service.name}
                </h4>
                {service.description && <p className="text-sm text-gray-400 mb-4" dangerouslySetInnerHTML={{ __html: service.description.replace(/\n/g, '<br />') }}></p>}
                
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-3xl font-bold text-primary">
                    {service.price.toLocaleString('ru-RU')} ₽
                  </span>
                </div>

                {service.additionalOptions && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-300 font-medium">Дополнительно:</p>
                    {service.additionalOptions.map(option => (
                      <div key={option.id} className="flex items-center justify-between p-3 bg-dark rounded-lg">
                        <div className="flex items-center gap-2">
                          {option.icon && <span>{option.icon}</span>}
                          <span>{option.name}</span>
                        </div>
                        <span className="text-primary font-semibold">
                          +{option.price.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Химчистка отдельных зон */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-center text-gray-300 border-b border-gray-600 pb-2 mb-4">
            Локальная химчистка
          </h3>
          {localCleaningServices.map(category => (
            <div key={category.id} className="bg-dark-secondary rounded-xl p-6 border border-dark-tertiary mt-4">
              <div className="space-y-3">
                {category.services.map(service => (
                  <ServiceItem key={service.id} service={service} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Кнопка записи */}
        <div className="mt-8">
          <button
            onClick={handleBooking}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Записаться
          </button>
        </div>
      </div>
    </div>
  );
};

export default Services;
