const chokidar = require('chokidar');
const { exec } = require('child_process');

console.log('Запуск слежения за изменениями файлов...');

// Следим за всеми файлами в проекте, кроме .git и node_modules
const watcher = chokidar.watch('./**/*', {
  ignored: [/node_modules/, /\.git/, /dist/, /build/, /coverage/],
  persistent: true
});

let timeout;

watcher.on('change', (path) => {
  console.log(`Обнаружено изменение в файле: ${path}`);
  
  // Устанавливаем таймаут, чтобы избежать множественных коммитов при быстрых изменениях
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    console.log('Фиксируем изменения и заливаем на Git...');
    
    const commitMessage = `Auto-commit: ${new Date().toLocaleString()}`;
    
    exec(`git add . && git commit -m "${commitMessage}" && git push origin main`, 
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Ошибка при выполнении Git команд: ${error.message}`);
          return;
        }
        
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        
        console.log(`stdout: ${stdout}`);
        console.log('Изменения успешно залиты на Git!');
      });
  }, 2000); // Задержка 2 секунды перед коммитом
});

process.on('SIGINT', () => {
  console.log('\nОстановка слежения за файлами.');
  process.exit(0);
});