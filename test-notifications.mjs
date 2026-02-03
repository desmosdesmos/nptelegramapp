// Тестовый скрипт для проверки системы уведомлений
import { spawn } from 'child_process';

// Данные для теста
const testData = {
  userId: 478799066,
  userName: "@yanvtg",
  result: {
    prize: {
      id: "test_prize_1",
      name: "Тестовый приз",
      type: "discount",
      value: 100,
      description: "Тестовое описание"
    },
    timestamp: new Date().toISOString()
  }
};

console.log("Отправка тестового запроса на сервер уведомлений...");

// Отправляем запрос на сервер уведомлений
const curlCommand = `curl -X POST http://localhost:3001/wheel-spin-result -H "Content-Type: application/json" -d '${JSON.stringify(testData)}'`;

const child = spawn(curlCommand, { shell: true });

child.stdout.on('data', (data) => {
  console.log(`Результат: ${data}`);
});

child.stderr.on('data', (data) => {
  console.error(`Ошибка: ${data}`);
});

child.on('close', (code) => {
  console.log(`Завершено с кодом: ${code}`);
});