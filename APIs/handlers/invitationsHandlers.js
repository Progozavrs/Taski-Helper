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

module.exports.deleteInvitation = function (req, res) {
    const { invitationUUID } = req.params;

    db.Invitations.findOne({
        where: {
            UUID: invitationUUID
        },
        include: {
            model: db.Groups,
            as: 'invitationGroup'
        }
    })
    .then(data => {
        if (!data) {
            res.status(404).json({
                message: 'Invitation не найден'
            });
            return;
        }

        if (data.credentialsUUID !== res.locals.UUID && data.invitationGroup.credentialsUUID !== res.locals.UUID) {
            res.status(403).json({
                message: 'У вас нет прав на удаление этого Invitation'
            });
            return;
        }

        data.destroy()
        .then(() => {
            res.status(200).json({
                message: 'Invitation было удалено'
            });
        })
    })
    .catch(error => {
        res.status(500).json({
            error: error.message
        });
    });
}

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

module.exports.changeInvitationAccess = function (req, res) {
    const { invitationUUID } = req.params;
    const { accessUUID } = req.body;

    db.Invitations.update({
        accessUUID: accessUUID
    }, {
        where: {
            invitationUUID: invitationUUID
        }
    })
    .then((result) => {
        if (!result) {
            return res.status(404).json({
                message: 'Invitation не найдено'
            });
        }
        res.status(200).json({
            message: 'Права доступа Invitation были обновлены'
        });
    })
    .catch((error) => {
        res.status(500).json({
            message: 'Ошибка сервера',
            error: error.message
        });
    });
}