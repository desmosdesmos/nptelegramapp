# 🚀 Деплой бэкенда на Railway

## Инструкция по шагам

### 1. Подготовка

Убедитесь, что у вас есть аккаунт на [Railway](https://railway.app/).

### 2. Создание нового проекта

1. Зайдите на [railway.app](https://railway.app/)
2. Нажмите **"New Project"**
3. Выберите **"Deploy from GitHub repo"**
4. Подключите ваш GitHub репозиторий с этим проектом

### 3. Настройка сервиса

1. В настройках проекта нажмите **"New"** → **"Empty Service"**
2. Перейдите в **"Settings"** сервиса
3. В разделе **"Root Directory"** укажите: `server`
4. В **"Start Command"** укажите: `node server.js`

### 4. Переменные окружения

В разделе **"Variables"** добавьте:

```
PORT=3001
CORS_ORIGIN=*
```

> **Важно:** После деплоя frontend укажите ваш домен Vercel в `CORS_ORIGIN`

### 5. Деплой

1. Railway автоматически начнёт деплой после настройки
2. Дождитесь завершения (статус станет "Deployed")
3. Скопируйте ваш публичный URL (вида `https://your-project.railway.app`)

### 6. Обновление frontend

Откройте файл `.env` в корне проекта и обновите:

```env
VITE_API_URL=https://your-project.railway.app
```

### 7. Деплой frontend на Vercel

```bash
git add .env
git commit -m "Update API URL for production"
git push
```

Vercel автоматически развернёт обновления.

---

## Проверка работы

### Тест API

```bash
curl https://your-project.railway.app/health
```

Ответ:
```json
{"status":"OK","timestamp":"2026-02-16T..."}
```

### Тест получения постов

```bash
curl -X POST https://your-project.railway.app/api/channel-posts \
  -H "Content-Type: application/json" \
  -d '{"channel":"npdetailing","limit":10}'
```

---

## Тарифы Railway

- **Бесплатно:** $5 кредитов в месяц (хватит для небольшого проекта)
- **Paid:** от $5/месяца за полноценный сервер

Для экономии можно отключить сервис, когда он не нужен.

---

## Альтернативы

- [Render.com](https://render.com/) - бесплатно с ограничениями
- [Fly.io](https://fly.io/) - бесплатно до определённого лимита
- Ваш сервер `185.171.202.83`
