const db = require('../../database/index');

module.exports.createGroup = (req, res) => {
    const { name, description } = req.body;
    db.Groups.create({
        name: name,
        description: description,
        credentialsUUID: req.user,
    })
    .then(group => {
        res.status(201).json(group);
    })
    .catch(err => {
        res.status(400).json(err);
    });
}

module.exports.getGroups = (req, res) => {
    const myGroups = db.Groups.findAll({
        where: {
            credentialsUUID: req.user.credentialsUUID
        },
        attributes: { 
            exclude: ['credentialsUUID'] 
        }
    });
    const foreignReadGroups = db.Groups.findAll({

    });
    const foreignUpdateGroups = db.Groups.findAll({

    });
    const promises = [myGroups, foreignReadGroups, foreignUpdateGroups];
    Promise.all(promises)
    .then(groups => {
        res.status(200).json(groups);
    })
    .catch(err => {
        res.status(500).json(err);
    });
};