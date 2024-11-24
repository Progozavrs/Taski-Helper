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

module.exports.updateStatusByDeadlineISO = function () {
    db.Tasks.update({ 
        statusUUID: "dca6d4c1-a9a3-11ef-af6a-3cecef0f521e" 
    }, {
        where: {
            deadlineISO: {
                [db.Op.lt]: new Date().toISOString()
            },
            statusUUID: {
                [db.Op.notIn]: ['dca6d4c1-a9a3-11ef-af6a-3cecef0f521e', '7e05098f-a9df-11ef-af6a-3cecef0f521e']
            }
        }
    })
    .then(result => {
        console.log(`Updated ${result[0]} tasks`);
    })
    .catch(error => {
        console.error('Error updating tasks:', error);
    });
}