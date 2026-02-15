@echo off
echo Добавление изменений в индекс...
git add src/pages/Booking.tsx src/utils/booking.ts

echo Создание коммита...
git commit -m "fix: удалены неиспользуемые импорты для устранения ошибок сборки"

echo Загрузка изменений на GitHub...
git push origin vercel-deploy

echo.
echo Готово! Изменения загружены на GitHub.
pause