@echo off
echo Добавление изменений в индекс...
git add src/App.tsx

echo Создание коммита...
git commit -m "fix: улучшена отладка для проверки админ-статуса пользователя"

echo Загрузка изменений на GitHub...
git push origin vercel-deploy

echo.
echo Готово! Изменения загружены на GitHub.
pause