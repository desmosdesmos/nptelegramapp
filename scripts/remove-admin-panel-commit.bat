@echo off
echo Добавление изменений в индекс...
git add src/App.tsx src/utils/telegram.ts

echo Создание коммита...
git commit -m "feat: удалена админ-панель и все привилегии для @yanvtg, интерфейс теперь одинаков для всех пользователей"

echo Загрузка изменений на GitHub...
git push origin vercel-deploy

echo.
echo Готово! Изменения загружены на GitHub.
pause