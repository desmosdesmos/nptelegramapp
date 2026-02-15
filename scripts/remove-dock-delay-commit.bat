@echo off
echo Добавление изменений в индекс...
git add src/App.tsx

echo Создание коммита...
git commit -m "perf: убрана задержка при отображении нижней панели"

echo Загрузка изменений на GitHub...
git push origin vercel-deploy

echo.
echo Готово! Изменения загружены на GitHub.
pause