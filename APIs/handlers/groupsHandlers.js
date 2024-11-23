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