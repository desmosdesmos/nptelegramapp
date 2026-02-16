# 🚀 Деплой бэкенда на Render.com — Пошаговая инструкция

## Шаг 1: Запушите код на GitHub

```bash
git add .
git commit -m "Добавлена конфигурация для Render backend"
git push origin main
```

## Шаг 2: Создайте Web Service на Render

1. Зайдите на https://dashboard.render.com
2. Нажмите **"New +"** → **"Web Service"**
3. Подключите GitHub (если ещё не подключён)
4. Выберите репозиторий: `desmosdesmos/mini-apk` (или ваш)
5. Нажмите **"Connect"**

## Шаг 3: Настройте сервис

Заполните поля:

| Поле | Значение |
|------|----------|
| **Name** | `np-telegram-backend` |
| **Region** | `Frankfurt, Germany` |
| **Branch** | `main` |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Instance Type** | `Free` |

## Шаг 4: Environment Variables

Нажмите **"Advanced"** → **"Add Environment Variable"** и добавьте:

```
PORT=3001
CORS_ORIGIN=*
```

## Шаг 5: Создайте сервис

Нажмите **"Create Web Service"**

Дождитесь деплоя (3-7 минут).

## Шаг 6: Скопируйте URL

После успешного деплоя вы увидите URL:
```
https://np-telegram-backend.onrender.com
```

Проверьте работу API:
```bash
curl https://np-telegram-backend.onrender.com/health
```

Должно вернуться:
```json
{"status":"OK","timestamp":"2026-02-16T..."}
```

## Шаг 7: Обновите frontend

1. Откройте `.env.production` в корне проекта
2. URL уже установлен: `https://np-telegram-backend.onrender.com`
3. Закоммитьте и запушите:

```bash
git add .env.production
git commit -m "Update API URL for production"
git push
```

Vercel автоматически пересоберёт и обновит frontend.

---

## Готово!

Новости должны появиться в приложении через 2-3 минуты после деплоя.

---

## Важные замечания

### ⚠️ Бесплатный тариф Render

- Сервис "засыпает" после 15 минут бездействия
- Первый запрос после простоя занимает **30-50 секунд**
- Это нормально для бесплатного тарифа

### 💰 Paid тариф (опционально)

- $7/месяц — сервис не засыпает
- Включите в настройках сервиса на Render

---

## Troubleshooting

### Новости не появились

1. Проверьте бэкенд: `curl https://np-telegram-backend.onrender.com/health`
2. Проверьте логи в Dashboard Render
3. Откройте консоль браузера (F12) и проверьте ошибки

### Ошибка CORS

Убедитесь, что `CORS_ORIGIN=*` в Environment Variables на Render.

### Таймаут при запросе

Это значит, что сервис "заснул". Подождите 30-50 секунд для первого запроса.
