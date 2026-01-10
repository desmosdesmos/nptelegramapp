#!/usr/bin/env node
/**
 * Скрипт для автоматического удаления lock-файлов
 * Не падает при ошибках - всегда завершается успешно
 */
try {
  const fs = require('fs');
  const path = require('path');

  const lockFiles = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'];

  lockFiles.forEach(file => {
    try {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      // Игнорируем ошибки - файл может быть заблокирован или не существовать
    }
  });
} catch (error) {
  // Игнорируем любые ошибки - скрипт не должен блокировать установку
}

// Всегда завершаем успешно (exit code 0)
process.exit(0);
