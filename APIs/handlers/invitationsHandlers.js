const db = require('../../database/index');

module.exports.createInvitation = function (req, res) {
    const { groupUUID, accessUUID, credentialsUUID } = req.body;

    db.Invitations.create({
        groupUUID: groupUUID,
        credentialsUUID: credentialsUUID,
        accessUUID: accessUUID,
    })
    .then(invitation => {
        res.status(200).json({
            invitation: invitation
        });
    })
};

module.exports.getGroupInvitations = function (req, res) {
    const { groupUUID } = req.params;

    db.Invitations.findAll({
        where: {
            groupUUID: groupUUID
        }
    })
    .then(invitations => {
        res.status(200).json({
            group: groupUUID,
            invitations: invitations
        });
    })
}