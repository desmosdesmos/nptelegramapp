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

  return (
    <div className="min-h-screen bg-dark px-4 py-6 pb-24 fade-in">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Контакты</h2>

        <div className="space-y-6">
          {/* Адрес */}
          <div className="bg-dark-secondary rounded-xl p-6 border border-dark-tertiary">
            <div className="flex items-start gap-4">
              <span className="text-3xl">📍</span>
              <div>
                <h3 className="font-semibold text-lg mb-1">Адрес</h3>
                <p className="text-gray-400">
                  ГСК Микрон (Кировский район)
                </p>
              </div>
            </div>
          </div>

          {/* Телефон */}
          <div className="bg-dark-secondary rounded-xl p-6 border border-dark-tertiary">
            <div className="flex items-start gap-4">
              <span className="text-3xl">📞</span>
              <div>
                <h3 className="font-semibold text-lg mb-1">Телефон</h3>
                <button
                  onClick={handlePhoneClick}
                  className="text-primary hover:text-primary-light transition-colors"
                >
                  +7 (906) 316-31-14
                </button>
                <p className="text-sm text-gray-400 mt-1">
                  Нажмите, чтобы позвонить
                </p>
              </div>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="space-y-3">
            <button
              onClick={handleTelegramChannelClick}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <span className="text-xl">📢</span>
              <span>Наш Telegram канал</span>
            </button>

            <button
              onClick={handleTelegramClick}
              className="w-full bg-dark-secondary hover:bg-dark-tertiary text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 border border-dark-tertiary"
            >
              <span className="text-xl">💬</span>
              <span>Написать в Telegram</span>
            </button>

            <button
              onClick={handleYandexMapsClick}
              className="w-full bg-dark-secondary hover:bg-dark-tertiary text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 border border-dark-tertiary"
            >
              <span className="text-xl">🗺️</span>
              <span>Открыть в Яндекс Картах</span>
            </button>
          </div>

          {/* Дополнительная информация */}
          <div className="bg-dark-secondary rounded-xl p-6 border border-dark-tertiary">
            <h3 className="font-semibold text-lg mb-2">Режим работы</h3>
            <div className="space-y-1 text-gray-400">
              <p>Пн - Пт: 09:00 - 19:00</p>
              <p>Сб - Вс: 10:00 - 18:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
