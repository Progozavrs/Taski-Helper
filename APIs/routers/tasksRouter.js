const router = require('express').Router();
const tasksHandlers = require('../handlers/tasksHandlers');
const multer = require('../../multer');

router.post('/', multer.fileUploader, multer.errorHandler, tasksHandlers.createTask);

router.get('/my', tasksHandlers.getMyTasks);

router.get('/:groupUUID', tasksHandlers.getGroupTasks);

router.post('/upload', multer.fileUploader, multer.errorHandler, tasksHandlers.attachFile);

router.put('/:taskUUID', tasksHandlers.changeTask);

module.exports = router;