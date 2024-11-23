const router = require('express').Router();
const tasksHandlers = require('../handlers/tasksHandlers');

router.post('/', tasksHandlers.createTask);

router.get('/my', tasksHandlers.getMyTasks);

router.get('/:groupUUID', tasksHandlers.getGroupTasks);

module.exports = router;