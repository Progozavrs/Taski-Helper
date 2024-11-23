const router = require('express').Router();
const tasksHandlers = require('../handlers/tasksHandlers');

router.post('/', tasksHandlers.createTask);

router.get('/my', tasksHandlers.getMyTasks);

module.exports = router;