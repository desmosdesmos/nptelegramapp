@echo off
echo Добавление изменений в индекс...
git add src/data/services.ts src/pages/Booking.tsx src/pages/Services.tsx src/utils/booking.ts

echo Создание коммита...
git commit -m "fix: восстановлены правильные услуги Комплекс и Предпродажная подготовка"

echo Загрузка изменений на GitHub...
git push origin vercel-deploy

echo.
echo Готово! Изменения загружены на GitHub.
pause