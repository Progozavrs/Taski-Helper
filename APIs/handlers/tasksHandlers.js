const db = require('../../database/index');
const fs = require('fs');


module.exports.createTask = function (req, res) {
    db.Tasks.create({
        name: req.body.name,
        description: req.body.description,
        deadlineISO: req.body.deadlineISO,
        fileLink: null,
        statusUUID: "552fc09c-a923-11ef-af6a-3cecef0f521e", // Назначено
        author: res.locals.UUID,
        group: req.body.group
    })
    .then(task => {
        res.status(200).json(task);
    })
    .catch(err => {
        res.status(500).json(err);
    });
}

module.exports.getMyTasks = function (req, res) {
    db.Tasks.findAll({
        where: {
            authorUID: res.locals.UUID
        },
        include: [
            {
                model: db.Statuses,
                as: 'taskStatus'
            }, 
            {
                model: db.Groups,
                as: 'taskGroup'
            }
        ]
    })
    .then(tasks => {
        res.status(200).json(tasks);
    })
    .catch(err => {
        res.status(500).json(err);
    });
};

module.exports.beforeUploadFile = function (req, res) {
    // Сделать валидацию доступа к загрузке файла
}

module.exports.afterUploadFile = function (req, res) {
    if (res.locals.multerError) {
        if (req.files?.["image"]?.[0]?.path) {
            fs.unlink(req.files["image"][0].path);
        }
        res.status(500).json(res.locals.multerError);
        return;
    }

    if (!req.files?.['file']?.[0]?.path) {
        res.status(422).send('Файл не был отправлен на сервер');
        return;
    }

    db.Tasks.update({
        fileLink: req.files['file'][0].path
    }, {
        where: {
            UUID: req.body.taskUUID
        }
    })
    .then(() => {
        res.status(200).json({
            filePath: req.files['file'][0].path
        });
    })
    .catch(err => {
        if (req.files?.["image"]?.[0]?.path) {
            fs.unlink(req.files["image"][0].path);
        }
        res.status(500).json(err);
    });
}

module.exports.getGroupTasks = function (req, res) {
    db.Tasks.findAll({
        where: {
            groupUUID: req.params.groupUUID
        },
        include: [
            {
                model: db.Statuses,
                as: 'taskStatus'
            }, 
            {
                model: db.Groups,
                as: 'taskGroup'
            }
        ]
    })
    .then(tasks => {
        res.status(200).json(tasks);
    })
    .catch(err => {
        res.status(500).json(err);
    });
}