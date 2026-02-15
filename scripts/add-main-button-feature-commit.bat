@echo off
echo Добавление изменений в индекс...
git add src/utils/telegram.ts

echo Создание коммита...
git commit -m "feat: добавлена функция для настройки главной кнопки в Telegram WebApp"

echo Загрузка изменений на GitHub...
git push origin vercel-deploy

echo.
echo Готово! Изменения загружены на GitHub.
pause