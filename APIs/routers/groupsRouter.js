const router = require('express').Router();
const groupsHandlers = require('../handlers/groupsHandlers');

router.post('/', groupsHandlers.createGroup);

router.get('/', groupsHandlers.getGroups);

router.delete('/:groupUUID', groupsHandlers.deleteGroup);

module.exports = router;