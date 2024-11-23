const router = require('express').Router();
const tasksHandlers = require('../handlers/tasksHandlers');
const multer = require('../../multer');

router.post('/', tasksHandlers.createTask);

router.get('/my', tasksHandlers.getMyTasks);

router.get('/:groupUUID', tasksHandlers.getGroupTasks);

router.post('/upload', tasksHandlers.beforeUploadFile, multer.fileUploader, multer.errorHandler, tasksHandlers.afterUploadFile);

router.put('/:taskUUID', tasksHandlers.changeTask);

module.exports = router;