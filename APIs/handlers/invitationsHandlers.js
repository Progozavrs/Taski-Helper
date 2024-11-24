const db = require('../../database/index');
const mail = require('../mail');

module.exports.createInvitation = async function (req, res) {
    try {
        const { groupUUID, credentialsUUID, accessUUID } = req.body;

        const group = await db.Groups.findOne({
            where: { 
                UUID: groupUUID 
            },
            include: {
                model: db.Credentials,
                as: 'groupOwner',
                include: {
                    model: db.Profiles,
                    as: 'userProfile'
                }
            }
        });

        if (!group) {
            return res.status(404).json({ message: 'Group не найден' });
        }

        if (group.credentialsUUID !== res.locals.UUID) {
            return res.status(403).json({ message: 'У вас нет прав на создание Invitation в этой Group' });
        }

        const target = await db.Profiles.findOne({
            where: { credentialsUUID: credentialsUUID }
        });

        if (!target) {
            return res.status(404).json({ message: 'Назначаемый пользователь не найден' });
        }

        const access = await db.Accesses.findOne({
            where: { UUID: accessUUID }
        });

        if (!access) {
            return res.status(404).json({ message: 'Access не найден' });
        }

        const invitation = await db.Invitations.create({
            groupUUID: groupUUID,
            credentialsUUID: credentialsUUID,
            accessUUID: accessUUID
        });

        // Подготовка письма
        const transporter = mail.transporter;
        const mailOptions = {
            from: mail.config.from,
            to: [group.groupOwner.userProfile.email, target.email],
            subject: `Пользователь ${target.lastName} ${target.firstName} добавлен в группу "${group.name}" пользователя ${group.groupOwner.userProfile.lastName} ${group.groupOwner.userProfile.firstName}`,
            text: `${target.lastName} ${target.firstName} теперь обладает правами "${access.name}" в группе ${group.name}. Управлять данным приглашением можно через ЛК.\nХорошего дня!`,
            html: `<h1>Пользователь ${target.lastName} ${target.firstName} добавлен в группу "${group.name}" пользователя ${group.groupOwner.userProfile.lastName} ${group.groupOwner.userProfile.firstName}</h1>
                <p>${target.lastName} ${target.firstName} теперь обладает правами "${access.name}" в группе ${group.name}. Управлять данным приглашением можно через ЛК.</p>
                <p>Хорошего дня!</p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Message sent: %s', info.messageId);
            }
        });

        res.status(200).json({ invitation: invitation });
    } 
    catch (error) {
        res.status(500).json({ error: error.message });
    }
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