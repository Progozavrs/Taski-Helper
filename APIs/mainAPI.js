const path = require('path');

const mainAPI = require('express')();

const usersRouter = require('./routers/usersRouter');

mainAPI.use('/users', usersRouter);

mainAPI.get('/', (req, res) => {
    res.send('Main API works');
})

// Если ни один обработчик не сработал
mainAPI.use((req, res) => {
    res.status(404).send();
})

module.exports = mainAPI