const router = require('express').Router();
const invitationsHandlers = require('../handlers/invitationsHandlers');

router.post('/', invitationsHandlers.createInvitation);

router.get('/:groupUUID', invitationsHandlers.getGroupInvitations);

module.exports = router;