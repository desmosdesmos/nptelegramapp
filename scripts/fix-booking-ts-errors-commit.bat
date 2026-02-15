@echo off
echo Добавление изменений в индекс...
git add src/pages/Booking.tsx

echo Создание коммита...
git commit -m "fix: исправлены ошибки типизации в Booking.tsx"

echo Загрузка изменений на GitHub...
git push origin vercel-deploy

echo.
echo Готово! Изменения загружены на GitHub.
pause