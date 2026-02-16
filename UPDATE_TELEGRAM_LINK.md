# Инструкция по обновлению ссылки Mini App в Telegram

## Проблема
Vercel задеплоил новую версию на другой URL, но Telegram всё ещё открывает старую версию.

## Решение

### Вариант 1: Обновить ссылку через BotFather (РЕКОМЕНДУЕТСЯ)

1. **Откройте @BotFather** в Telegram
2. **Отправьте команду**: `/mybots`
3. **Выберите вашего бота**: `@nptime_bot`
4. **Нажмите**: `Bot Settings` → `Menu Button` → `Configure Menu Button`
5. **Отправьте новую ссылку**:
   ```
   https://mini-jhxhjazmv-desmosdesmos-projects.vercel.app
   ```
6. **Введите название кнопки**: `NP Fast` или `Открыть приложение`

### Вариант 2: Пересоздать Web App

1. **Откройте @BotFather**
2. **Отправьте**: `/newapp`
3. **Выберите бота**: `@nptime_bot`
4. **Введите название**: `NP Detailing`
5. **Отправьте ссылку**: `https://mini-jhxhjazmv-desmosdesmos-projects.vercel.app`
6. **Загрузите иконку** (опционально)

### Вариант 3: Обновить Inline-кнопку

Если у вас настроена inline-кнопка для открытия Mini App, обновите URL в коде бота на:
```
https://mini-jhxhjazmv-desmosdesmos-projects.vercel.app
```

---

## Проверка

После обновления ссылки:

1. **Закройте Telegram полностью** (не просто сверните)
2. **Откройте Telegram снова**
3. **Перейдите в бота** `@nptime_bot`
4. **Нажмите на кнопку меню** (или откройте Mini App)
5. **Перейдите в раздел "Новости"**

Новости должны загрузиться! ✅

---

## Текущий рабочий URL

```
https://mini-jhxhjazmv-desmosdesmos-projects.vercel.app
```

Или короткий:
```
https://mini-apk.vercel.app
```

---

## Важно

- Убедитесь, что **ngrok запущен** на сервере
- API endpoint: `https://iatrochemical-winterishly-kenda.ngrok-free.dev/api/channel-posts`
- Сервер должен быть доступен