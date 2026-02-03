@echo off
echo Автоматическая заливка изменений на Git...

REM Проверяем статус репозитория
git status

REM Добавляем все изменения
git add .

REM Создаем коммит с автоматическим сообщением
git commit -m "Auto-commit: %date% %time%"

REM Отправляем изменения на удаленную ветку
git push origin main

echo Заливка завершена.
pause