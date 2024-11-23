const db = require('../../database/index');

module.exports.createGroup = function (req, res) {
    db.Groups.create({
        name: req.body.name,
        description: req.body.description,
        credentialsUUID: res.locals.UUID,
    })
    .then(group => {
        res.status(201).json(group);
    })
    .catch(err => {
        res.status(400).json(err.message);
    });
}

module.exports.getGroups = function (req, res) {
    const myGroups = db.Groups.findAll({
        where: {
            credentialsUUID: res.locals.UUID,
        },
    })
    const foreignGroups = db.Invitations.findAll({
        where: {
            credentialsUUID: res.locals.UUID,
        },
        include: [
            {
                model: db.Accesses,
                as: 'invitationAccess',
            },
            {
                model: db.Groups,
                as: 'invitationGroup',
            }
        ]
    })
    const promises = [myGroups, foreignGroups];
    Promise.all(promises)
    .then(groups => {
        res.json(groups);
    })
    .catch(err => {
        res.status(500).json(err.message);
    }); 
};

module.exports.getGroup = function (req, res) {
    db.Groups.findOne({
        where: {
            UUID: req.params.groupUUID,
        }
    })
    .then(async group => {
        const inv = await group.getGroupInvitations({
            include: {
                model: db.Accesses,
                as: 'invitationAccess',
            }
        });
        if (group.credentialsUUID == res.locals.UUID) {
            res.json({
                group: group,
                invitations: inv,
            });
            return;
        }
        else {
            const my_inv = inv.filter(i => i.credentialsUUID == res.locals.UUID);
            res.json({
                group: group,
                invitations: my_inv,
            });
        }
    })
    .catch(err => {
        res.status(500).json(err.message);
    });
}

module.exports.deleteGroup = function (req, res) {
    db.Groups.destroy({
        where: {
            UUID: req.params.groupUUID,
            credentialsUUID: res.locals.UUID,
        }
    })
    .then(() => {
        res.status(204).send();
    })
    .catch(err => {
        res.status(500).json(err.message);
    });
}

module.exports.updateGroup = function (req, res) {
    db.Groups.findOne({
        where: {
            UUID: req.params.groupUUID,
            credentialsUUID: res.locals.UUID,
        }
    })
    .then(group => {
        if (!group) {
            res.status(404).send('Группа не найдена');
            return;
        }
        if (group.credentialsUUID != res.locals.UUID) {
            res.status(403).send('У вас недостаточно прав на редактирование');
            return;
        }
        db.Groups.update({
            name: req.body.name,
            description: req.body.description,
        }, {
            where: {
                UUID: req.params.groupUUID,
            }
        })
        .then(() => {
            res.status(200).send('Группа обновлена');
        })
        .catch(err => {
            res.status(500).json(err.message);
        });
    })
}