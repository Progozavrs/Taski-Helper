const router = require('express').Router();
const usersHandlers = require('../handlers/usersHandlers');

router.get('/:uuid', usersHandlers.getProfile);

router.get('/', usersHandlers.getMyProfile);

module.exports = router;