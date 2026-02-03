const testResult = {
  prize: {
    name: "Тестовый приз",
    type: "discount",
    value: 100,
    id: "test_prize_1"
  },
  timestamp: new Date().toISOString()
};

const testData = {
  userId: 478799066,
  userName: "@yanvtg",
  result: testResult
};

fetch('http://localhost:3001/wheel-spin-result', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData)
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));