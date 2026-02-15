@echo off
echo Добавление изменений в индекс...
git add src/App.tsx src/pages/AdminPanel.tsx src/data/services.ts

echo Создание коммита...
git commit -m "feat: обновлена админ-панель с синхронизацией услуг и улучшенным интерфейсом"

echo Загрузка изменений на GitHub...
git push origin vercel-deploy

echo.
echo Готово! Изменения загружены на GitHub.
pause