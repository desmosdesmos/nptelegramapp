import { hapticFeedback } from '../utils/telegram';
import { PageKey } from '../App';
import { mainServices, localCleaningServices } from '../data/services';
import type { Service } from '../types/services';

interface ServicesProps {
  onNavigate: (pageKey: PageKey) => void;
}

// Redesigned ServiceItem for the local cleaning list
const ServiceItem: React.FC<{ service: Service }> = ({ service }) => (
  <div className="flex items-center justify-between p-4 bg-glass border border-glass-border rounded-lg">
    <div className="flex items-center gap-3">
      {service.icon && <span className="text-xl">{service.icon}</span>}
      <span className="text-text-primary">{service.name}</span>
      {service.unitLabel && <span className="text-sm text-text-secondary">{service.unitLabel}</span>}
    </div>
    <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-accent-primary to-accent-secondary">
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
    <div className="min-h-screen px-4 py-8 pb-32 fade-in">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-text-primary">Услуги и цены</h2>

        <div className="space-y-12">
          {/* Основные услуги */}
          <div>
            <h3 className="text-2xl font-bold text-center text-text-primary pb-4 mb-6">
              Основные комплексы
            </h3>
            <div className="space-y-8">
              {mainServices.map(category =>
                category.services.map(service => (
                  <div key={service.id} className="bg-glass backdrop-blur-xl rounded-2xl p-6 border border-glass-border shadow-glow-sm">
                    <h4 className="text-2xl font-semibold mb-3 flex items-center gap-3 text-text-primary">
                      {service.icon} {service.name}
                    </h4>
                    {service.description && <p className="text-base text-text-secondary mb-6" dangerouslySetInnerHTML={{ __html: service.description.replace(/\n/g, '<br />') }}></p>}
                    
                    <div className="flex items-baseline gap-3 mb-6">
                      <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-primary to-accent-secondary">
                        {service.price.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>

                    {service.additionalOptions && (
                      <div className="space-y-3 pt-4 border-t border-glass-border">
                        <p className="text-sm text-text-secondary font-medium">Дополнительно:</p>
                        {service.additionalOptions.map(option => (
                          <div key={option.id} className="flex items-center justify-between p-3 bg-bg-dark-secondary/50 rounded-lg">
                            <div className="flex items-center gap-2">
                              {option.icon && <span>{option.icon}</span>}
                              <span className="text-text-primary">{option.name}</span>
                            </div>
                            <span className="font-semibold text-accent-primary">
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
          </div>

          {/* Химчистка отдельных зон */}
          <div className="pt-8">
            <h3 className="text-2xl font-bold text-center text-text-primary pb-4 mb-6">
              Локальная химчистка
            </h3>
            <div className="bg-glass backdrop-blur-xl rounded-2xl p-6 border border-glass-border">
              <div className="space-y-3">
                {localCleaningServices.flatMap(cat => cat.services).map(service => (
                  <ServiceItem key={service.id} service={service} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Кнопка записи */}
        <div className="mt-12">
          <button
            onClick={handleBooking}
            className="w-full bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-bold py-4 px-6 rounded-full text-lg soft-press"
          >
            Записаться онлайн
          </button>
        </div>
      </div>
    </div>
  );
};

export default Services;
