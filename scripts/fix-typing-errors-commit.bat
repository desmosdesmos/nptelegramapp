@echo off
echo Добавление изменений в индекс...
git add src/App.tsx src/pages/AdminPanel.tsx

echo Создание коммита...
git commit -m "fix: исправлены ошибки типизации в админ-панели"

echo Загрузка изменений на GitHub...
git push origin vercel-deploy

echo.
echo Готово! Изменения загружены на GitHub.
pause