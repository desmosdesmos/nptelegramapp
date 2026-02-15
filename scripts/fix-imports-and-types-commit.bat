@echo off
echo Добавление изменений в индекс...
git add src/data/services.ts src/pages/AdminPanel.tsx src/pages/Booking.tsx src/utils/booking.ts src/pages/Services.tsx

echo Создание коммита...
git commit -m "fix: исправлены импорты и типы для синхронизации админ-панели с другими страницами"

echo Загрузка изменений на GitHub...
git push origin vercel-deploy

echo.
echo Готово! Изменения загружены на GitHub.
pause