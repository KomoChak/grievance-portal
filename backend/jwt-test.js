const jwt = require('jsonwebtoken');

const token = jwt.sign({ test: 'ok' }, 'testsecret', { expiresIn: '1h' });
console.log('TOKEN:', token);

const decoded = jwt.verify(token, 'testsecret');
console.log('DECODED:', decoded);
