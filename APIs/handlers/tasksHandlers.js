const db = require('../../database/index');
const fs = require('fs');
const path = require('path');

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
            authorUUID: res.locals.UUID
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

module.exports.beforeUploadFile = function (req, res, next) {
    db.Tasks.findOne({
        where: {
            UUID: req.body.taskUUID
        }
    })
    .then(task => {
        if (!task) {
            res.status(404).send('Задача не найдена');
            return;
        }

        if (task.authorUUID != res.locals.UUID) {
            res.status(403).send('Вы не являетесь автором этой задачи');
            return;
        }

        // Проверка, что файлы уже были загружены
        // TODO - Сделать проверку что файлов <= 5, и потом обновлять список
        if (task.fileLink && JSON.parse(task.fileLink).length > 0) { 
            res.status(403).send('Файлы уже были загружены, нельзя добавлять новые файлы');
            return;
        }

        next();
    })
    .catch(err => {
        res.status(500).json(err);
    });
}

module.exports.afterUploadFile = function (req, res) {
    const errorsArray = [];

    // Проверка наличия ошибок multer
    if (res.locals.multerError) {
        if (req.files?.['file']) {
            req.files['file'].forEach(file => {
                fs.unlink(file.path, (err) => {
                    if (err) console.error('Ошибка при удалении файла:', err);
                });
            });
        }
        res.status(500).json(res.locals.multerError);
        return;
    }

    // Проверка наличия загруженных файлов
    if (!req.files?.['file'] || req.files['file'].length === 0) {
        errorsArray.push('Файлы не были отправлены на сервер');
        res.status(422).json({ errors: errorsArray });
        return;
    }

    const filePaths = req.files['file'].map(file => file.path);

    // Обновление записи в базе данных
    db.Tasks.update({
        fileLink: JSON.stringify(filePaths)
    }, {
        where: {
            UUID: req.body.taskUUID
        }
    })
    .then(() => {
        res.status(200).json({
            filePaths: filePaths
        });
    })
    .catch(err => {
        // Удаление файлов в случае ошибки
        req.files['file'].forEach(file => {
            fs.unlink(file.path, (unlinkErr) => {
                if (unlinkErr) console.error('Ошибка при удалении файла:', unlinkErr);
            });
        });
        errorsArray.push('Ошибка при сохранении путей файлов в базе данных');
        res.status(500).json({ errors: errorsArray, dbError: err });
    });
};