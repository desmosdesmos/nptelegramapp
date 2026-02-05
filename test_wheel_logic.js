// Тестирование логики ограничения попыток колеса фортуны
console.log('Тестируем логику ограничения попыток колеса фортуны...\n');

// Имитация localStorage
let localStorageMock = {};

// Функция для установки значения в localStorage
function setItem(key, value) {
  localStorageMock[key] = value;
  console.log(`Установлено значение в localStorage: ${key} = ${value}`);
}

// Функция для получения значения из localStorage
function getItem(key) {
  const value = localStorageMock[key];
  console.log(`Получено значение из localStorage: ${key} = ${value}`);
  return value;
}

// Функция проверки доступности вращения
function checkSpinAvailability() {
  console.log('\nПроверяем доступность вращения...');
  
  // Получаем дату последнего вращения
  const lastSpinDate = getItem('wheel_last_spin_date');
  const today = new Date().toISOString().split('T')[0];
  
  console.log(`Дата последнего вращения: ${lastSpinDate}`);
  console.log(`Текущая дата: ${today}`);
  
  let canSpin;
  if (lastSpinDate === today) {
    canSpin = false;
    console.log('Результат: сегодня уже было вращение, нельзя крутить');
  } else {
    canSpin = true;
    console.log('Результат: сегодня еще не было вращения, можно крутить');
  }
  
  return canSpin;
}

// Тест 1: Проверяем, что можно вращать, если дата последнего вращения не совпадает с сегодняшней
console.log('=== Тест 1: Проверка возможности вращения без предыдущего вращения ===');
let canSpin = checkSpinAvailability();
console.log(`Можно вращать: ${canSpin}\n`);

// Тест 2: Имитируем успешное вращение и установку даты
console.log('=== Тест 2: Имитация успешного вращения ===');
const today = new Date().toISOString().split('T')[0];
setItem('wheel_last_spin_date', today);
console.log('Установлена дата последнего вращения на сегодня\n');

// Тест 3: Проверяем, что после вращения нельзя вращать снова
console.log('=== Тест 3: Проверка невозможности повторного вращения в тот же день ===');
canSpin = checkSpinAvailability();
console.log(`Можно вращать: ${canSpin}\n`);

// Тест 4: Проверяем смену дня
console.log('=== Тест 4: Проверка возможности вращения на следующий день ===');
// Имитируем вчерашнюю дату
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]; // 86400000 мс = 1 день
setItem('wheel_last_spin_date', yesterday);
console.log(`Установлена дата последнего вращения на вчера: ${yesterday}`);

canSpin = checkSpinAvailability();
console.log(`Можно вращать: ${canSpin}\n`);

console.log('Тестирование завершено.');