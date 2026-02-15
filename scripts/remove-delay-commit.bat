@echo off
echo Добавление изменений в индекс...
git add src/main.tsx

echo Создание коммита...
git commit -m "perf: убрана ненужная задержка при инициализации приложения"

echo Загрузка изменений на GitHub...
git push origin vercel-deploy

echo.
echo Готово! Изменения загружены на GitHub.
pause