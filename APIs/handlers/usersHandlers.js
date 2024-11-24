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
    const searchLine = req.body.searchLine;
    const searchWords = searchLine.split(' ');
    db.Profiles.findAll({
        where: {
            [db.Op.or]: searchWords.map(word => ({
                [db.Op.or]: [
                    {
                        firstName: {
                            [db.Op.like]: `%${word}%`
                        }
                    },
                    {
                        lastName: {
                            [db.Op.like]: `%${word}%`
                        }
                    }
                ]
            }))
        },
        include: {
            model: db.Credentials,
            as: 'userCredentials',
        }
    })
    .then(users => {
        res.json(users);
    })

}