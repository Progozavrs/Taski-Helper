const path = require('path');

const mainAPI = require('express')();

const usersRouter = require('./routers/usersRouter');
const groupsRouter = require('./routers/groupsRouter');
const invitationsRouter = require('./routers/invitationsRouter');
const tasksRouter = require('./routers/tasksRouter');
const variousRouter = require('./routers/variousRouter');

mainAPI.use('/users', usersRouter);
mainAPI.use('/groups', groupsRouter);
mainAPI.use('/invitations', invitationsRouter);
mainAPI.use('/tasks', tasksRouter);
mainAPI.use('/vars', variousRouter);

mainAPI.get('/', (req, res) => {
    res.send('Main API works');
})

// Если ни один обработчик не сработал
mainAPI.use((req, res) => {
    res.status(404).send();
})

module.exports = mainAPI