import { hapticFeedback, openTelegramLink } from '../utils/telegram';

const Contacts = () => {
  const handleTelegramClick = () => {
    hapticFeedback('light');
    openTelegramLink('https://t.me/npdetailing');
  };

  const handleYandexMapsClick = () => {
    hapticFeedback('light');
    window.open('https://yandex.ru/maps/-/CLXsAPYJ', '_blank');
  };

  const handleTelegramChannelClick = () => {
    hapticFeedback('light');
    openTelegramLink('https://t.me/npdetailing');
  };

  const handlePhoneClick = () => {
    hapticFeedback('light');
    window.location.href = 'tel:+79063163114';
  };

  const contactItems = [
    {
      icon: '📍',
      title: 'Адрес',
      value: 'ГСК Микрон (Кировский район)',
      action: handleYandexMapsClick,
      actionLabel: 'Построить маршрут'
    },
    {
      icon: '📞',
      title: 'Телефон',
      value: '+7 (906) 316-31-14',
      action: handlePhoneClick,
      actionLabel: 'Позвонить'
    },
    {
      icon: '⏰',
      title: 'Режим работы',
      value: 'Пн - Вс: 09:00 - 19:00',
    },
    {
      icon: '💬',
      title: 'Telegram для связи',
      value: '@npdetailing',
      action: handleTelegramClick,
      actionLabel: 'Написать'
    },
  ];

  return (
    <div className="min-h-screen px-4 py-8 pb-32 fade-in">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-text-primary">Контакты</h2>

        <div className="space-y-8">
          {/* Unified Contact Card */}
          <div className="bg-glass backdrop-blur-xl border border-glass-border rounded-2xl p-6 shadow-lg">
            <div className="space-y-6">
              {contactItems.map(item => (
                <div key={item.title} className="flex items-start gap-5">
                  <span className="text-3xl mt-1">{item.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-text-primary">{item.title}</h3>
                    <p className="text-text-secondary">{item.value}</p>
                    {item.action && (
                       <button onClick={item.action} className="text-accent-primary font-semibold text-sm hover:text-accent-secondary transition-colors">
                        {item.actionLabel}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-4">
            <button
              onClick={handleTelegramChannelClick}
              className="w-full bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-bold py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-glow active:scale-98 text-lg"
            >
              Наш Telegram канал
            </button>
            
            <button
              onClick={handleYandexMapsClick}
              className="w-full bg-glass backdrop-blur-xl border border-glass-border text-text-primary font-semibold py-3 px-5 rounded-2xl transition-all duration-300 hover:border-accent-primary/50 hover:scale-105 active:scale-98"
            >
              Мы на Яндекс Картах
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;

