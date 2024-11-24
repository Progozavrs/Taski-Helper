const router = require('express').Router();
const groupsHandlers = require('../handlers/groupsHandlers');

router.post('/', groupsHandlers.createGroup);

router.get('/', groupsHandlers.getGroups);

router.get('/:groupUUID', groupsHandlers.getGroup);

router.delete('/:groupUUID', groupsHandlers.deleteGroup);

router.put('/:groupUUID', groupsHandlers.updateGroup);

module.exports = router;