const db = require('../../database/index');


module.exports.getProfile = function (req, res) {
    db.Profiles.findOne({
        attributes: { 
            exclude: ['UUID', 'createdAt', 'updatedAt']
        },
        where: {
            UUID: req.params.uuid, // UUID профиля, не credentials
        },
    })
    .then(user => {
        res.json(user);
    })
    .catch(err => {
        res.status(500).json({ message: 'Ошибка сервера' });
    });
}

module.exports.getMyProfile = function (req, res) {
    db.Profiles.findOne({
        attributes: { 
            exclude: ['UUID', 'createdAt', 'updatedAt']
        },
        where: {
            credentialsUUID: res.locals.UUID,
        },
    })
    .then(user => {
        res.json(user);
    })
    .catch(err => {
        res.status(500).json({ message: 'Ошибка сервера' });
    });
}

module.exports.findCredentials = function (req, res) {
    const firstName = req.query.firstName;
    const lastName = req.query.lastName;
    db.Profiles.findOne({
        where: {
            firstName: firstName,
            lastName: lastName,
        },
        include: {
            model: db.Credentials,
            as: 'userCredentials',
        }
    })
    .then(user => {
        if (user) {
            res.json({
                user: user,
                message: "OK"
            });
        } 
        else {
            res.json({
                user: null,
                message: 'Пользователь с такими ФИ не найден' 
            });
        }
    })
}