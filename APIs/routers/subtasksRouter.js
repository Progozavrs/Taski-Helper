const router = require('express').Router();
const subtasksHandlers = require('../handlers/subtasksHandlers');
const multer = require('../../multer');

router.get('/', subtasksHandlers.getSubtasks);

router.post('/:taskUUID', multer.fileUploader, multer.errorHandler, subtasksHandlers.createSubtask);

module.exports = router;