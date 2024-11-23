const db = require('../../database/index');

module.exports.getAllAccesses = function (req, res) {
    db.Accesses.findAll()
    .then(accesses => {
        res.status(200).json(accesses);
    })
}

module.exports.getAllStatuses = function (req, res) {
    db.Statuses.findAll()
    .then(statuses => {
        res.status(200).json(statuses);
    })
}