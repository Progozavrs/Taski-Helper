const router = require('express').Router();
const subtasksHandlers = require('../handlers/subtasksHandlers');
const multer = require('../../multer');

router.get('/:taskUUID', subtasksHandlers.getSubtasks);

router.post('/:taskUUID', multer.fileUploader, multer.errorHandler, subtasksHandlers.createSubtask);

router.delete('/:subtaskUUID', subtasksHandlers.deleteSubtask);

module.exports = router;