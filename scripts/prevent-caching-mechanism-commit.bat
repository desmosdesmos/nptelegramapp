@echo off
echo Добавление изменений в индекс...
git add index.html

echo Создание коммита...
git commit -m "feat: добавлен механизм предотвращения кэширования в Telegram WebApp"

echo Загрузка изменений на GitHub...
git push origin vercel-deploy

echo.
echo Готово! Изменения загружены на GitHub.
pause