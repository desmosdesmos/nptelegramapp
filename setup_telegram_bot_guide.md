# Инструкция по настройке Telegram Bot для прямого открытия Mini App

## Через BotFather

### Метод 1: Использование Menu Button
1. Откройте Telegram и найдите @BotFather
2. Отправьте команду `/setmenubutton`
3. Выберите вашего бота из списка
4. Введите URL вашего Mini App: `https://nptelegramapp-git-vercel-deploy-desmosdesmos.vercel.app` (замените на ваш актуальный URL)
5. Введите название кнопки: `NP Fast`

### Метод 2: Создание нового Web App
1. Откройте Telegram и найдите @BotFather
2. Отправьте команду `/newapp`
3. Выберите вашего бота из списка
4. Введите название вашего приложения: `NP Fast`
5. Введите короткое описание: `Mini App для записи на химчистку`
6. Введите URL вашего Mini App: `https://nptelegramapp-git-vercel-deploy-desmosdesmos.vercel.app` (замените на ваш актуальный URL)
7. Загрузите иконку приложения (рекомендуется 1:1 квадратное изображение, не более 512x512)

### Метод 3: Настройка Inline клавиатуры через код бота
Если вы управляете кодом бота (не через BotFather), вы можете добавить кнопку Web App в ответ на команду /start:

```javascript
const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('Добро пожаловать!', {
    reply_markup: {
      inline_keyboard: [
        [{
          text: 'Открыть NP Fast',
          web_app: { url: 'https://nptelegramapp-git-vercel-deploy-desmosdesmos.vercel.app' }
        }]
      ]
    }
  });
});
```

## Важные замечания

1. **URL должен быть HTTPS** - Telegram требует безопасное соединение
2. **Домен должен совпадать** с тем, что указан в настройках бота
3. **Приложение должно быть готово** к работе в Telegram Web App (поддерживать Telegram Web Apps SDK)
4. **Проверьте, что ваше приложение корректно обрабатывает initData** от Telegram

## Проверка настройки

После настройки:
1. Перейдите в своего бота
2. Нажмите на кнопку меню (три линии в правом нижнем углу)
3. Должна появиться кнопка, которая открывает ваше Mini App напрямую

## Обновление реферальных ссылок

После настройки прямого открытия, пользователи смогут использовать ссылки вида:
`https://t.me/nptime_bot` (и нажимать кнопку в интерфейсе бота)
или
`https://t.me/nptime_bot/startapp?start=USER123456` (для передачи реферального кода)

## Примечание

Telegram не позволяет напрямую открывать Mini App по ссылке типа `https://t.me/username/app` без взаимодействия с ботом. Единственный способ - это через кнопку в интерфейсе бота или через inline-клавиатуру.