const router = require('express').Router();
const groupsHandlers = require('../handlers/groupsHandlers');

router.post('/', groupsHandlers.createGroup);

router.get('/', groupsHandlers.getGroups);

module.exports = router;