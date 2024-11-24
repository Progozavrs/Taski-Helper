const router = require('express').Router();
const invitationsHandlers = require('../handlers/invitationsHandlers');

router.post('/', invitationsHandlers.createInvitation);

router.get('/:groupUUID', invitationsHandlers.getGroupInvitations);

router.delete('/:invitationUUID', invitationsHandlers.deleteInvitation);

module.exports = router;