const db = require('../../database/index');


module.exports.getProfile = function (req, res) {
    db.Profiles.findOne({
        attributes: { 
            exclude: ['UUID', 'createdAt', 'updatedAt']
        },
        where: {
            UUID: req.params.uuid,
        },
    })
    .then(user => {
        res.json(user);
    })
    .catch(err => {
        res.status(500).json({ message: 'Ошибка сервера' });
    });
}