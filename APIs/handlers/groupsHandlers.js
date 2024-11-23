const db = require('../../database/index');

module.exports.createGroup = function (req, res) {
    db.Groups.create({
        name: req.body.name,
        description: req.body.description,
        credentialsUUID: req.user,
    })
    .then(group => {
        res.status(201).json(group);
    })
    .catch(err => {
        res.status(400).json(err);
    });
}

module.exports.getGroups = function (req, res) {
    const myGroups = db.Groups.findOne({
        where: {
            credentialsUUID: req.user,
        },
    })
    const foreignGroups = db.Invitations.findAll({
        where: {
            credentialsUUID: req.user,
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
        res.status(500).json(err);
    });
    
};