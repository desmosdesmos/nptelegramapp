# 🚀 Деплой бэкенда на Render.com

## Быстрый деплой (бесплатно)

### 1. Зайдите на [Render.com](https://render.com/)

### 2. Создайте новый Web Service

1. Нажмите **"New +"** → **"Web Service"**
2. Подключите GitHub аккаунт
3. Выберите репозиторий: `desmosdesmos/nptelegramapp`
4. Нажмите **"Connect"**

### 3. Настройте сервис

| Поле | Значение |
|------|----------|
| **Name** | `np-telegram-backend` |
| **Region** | `Frankfurt, Germany` (ближе к России) |
| **Branch** | `vercel-deploy` |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Instance Type** | `Free` |

### 4. Environment Variables

Нажмите **"Advanced"** → **"Add Environment Variable"**:

```
PORT=3001
CORS_ORIGIN=*
```

### 5. Создайте сервис

Нажмите **"Create Web Service"**

Дождитесь деплоя (~2-5 минут).

### 6. Скопируйте URL

После деплоя вы увидите URL вида:
```
https://np-telegram-backend.onrender.com
```

### 7. Обновите frontend

Откройте `.env` в корне проекта:

```env
VITE_API_URL=https://np-telegram-backend.onrender.com
```

Закоммитьте и отправьте:

```bash
git add .env
git commit -m "Update API URL for Render production"
git push
```

---

## Проверка API

```bash
curl https://np-telegram-backend.onrender.com/health
```

---

## Тарифы Render

- **Бесплатно:** 
  - 750 часов в месяц (24/7 весь месяц)
  - После 15 мин неактивности сервис "засыпает"
  - Первый запрос после простоя занимает ~30 сек

- **Paid:** от $7/месяц без ограничений

---

## Примечание

Бесплатный сервис на Render "засыпает" после 15 минут бездействия. 
Для первого запроса после простоя потребуется ~30-50 секунд.
Это нормально для бесплатного тарифа.

Для продакшена рекомендуется:
- Paid тариф на Render ($7/мес)
- Или Railway ($5/мес кредиты)
- Или ваш сервер 185.171.202.83