const router = require('express').Router();
const varoiusHandlers = require('../handlers/variousHandlers');

router.get('/accesses', varoiusHandlers.getAllAccesses);

router.get('/statuses', varoiusHandlers.getAllStatuses);

module.exports = router;