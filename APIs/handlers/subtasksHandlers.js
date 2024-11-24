const db = require('../../database/index');

module.exports.getSubtasks = function (req, res) {
    db.Tasks.findOne({
        where: {
            UUID: req.body.taskUUID,
        },
        include: [{
            model: db.Subtasks,
            as: 'taskSubtasks',
            include: [{
                model: db.Statuses,
                as: 'subtaskStatus',
            }],
        }]
    })
    .then((task) => {
        res.status(200).send(task.subtasks);
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    });
}

module.exports.createSubtask = async function (req, res) {
    const { taskUUID } = req.params;

    const task = await db.Tasks.findOne({
        where: {
            UUID: taskUUID,
        }
    })

    const filePaths = req.files?.['file']?.map(file => file.path) || [];


    if (!task) {
        delpdf(filePaths)
        .then(() => {
            console.log('Files deleted successfully');
        })
        .catch(error => {
            console.error('Error deleting files:', error);
        });
        return res.status(404).json({
            error: 'Задача не найдена'
        });
    }
    if (task.authorUUID !== req.user.UUID) {
        delpdf(filePaths)
        .then(() => {
            console.log('Files deleted successfully');
        })
        .catch(error => {
            console.error('Error deleting files:', error);
        });
        return res.status(403).json({
            error: 'Вы не являетесь автором задачи'
        });
    }
    if (res.locals.multerError) {
        delpdf(filePaths)
        .then(() => {
            console.log('Files deleted successfully');
        })
        .catch(error => {
            console.error('Error deleting files:', error);
        });
        res.status(500).json(res.locals.multerError);
    }

    db.Subtasks.create({
        UUID: req.body.subtaskUUID,
        name: req.body.name,
        description: req.body.description,
        fileLink: JSON.stringify(filePaths),
        statusUUID: req.body.statusUUID,
        taskUUID: req.body.taskUUID,
    })
    .then(new_subtask => {
        res.status(200).json({
            subtask: new_subtask
        });
    })
    .catch((err) => {
        res.status(500).json({ 
            error: err.message 
        });
    });
}

module.exports.deleteSubtask = function (req, res) {
    db.Subtasks.destroy({
        where: {
            UUID: req.params.subtaskuuid,
        }
    })
    .then(() => {
        res.status(200).json({
            message: 'Subtask deleted successfully.'
        });
    })
    .catch((err) => {
        res.status(500).json({ 
            error: err.message 
        });
    });
}