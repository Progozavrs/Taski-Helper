const router = require('express').Router();
const usersHandlers = require('../handlers/usersHandlers');

router.get('/:uuid', usersHandlers.getProfile);

router.get('/', usersHandlers.getMyProfile);

router.post('/find', usersHandlers.findCredentials);

module.exports = router;