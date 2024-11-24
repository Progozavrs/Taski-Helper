const db = require('../../database/index');

module.exports.getSubtasks = function (req, res) {
    db.Tasks.findOne({
        where: {
            UUID: req.params.taskUUID,
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
        res.status(200).json(task.taskSubtasks);
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    });
}

module.exports.createSubtask = async function (req, res) {
    const { taskUUID } = req.params;

    // const task = await db.Tasks.findOne({
    //     where: {
    //         UUID: taskUUID,
    //     }
    // })

    // const filePaths = req.files?.['file']?.map(file => file.path) || [];

    // if (!task) {
    //     delpdf(filePaths)
    //     .then(() => {
    //         console.log('Files deleted successfully');
    //     })
    //     .catch(error => {
    //         console.error('Error deleting files:', error);
    //     });
    //     return res.status(404).json({
    //         error: 'Задача не найдена'
    //     });
    // }
    // if (task.authorUUID !== req.user.UUID) {
    //     delpdf(filePaths)
    //     .then(() => {
    //         console.log('Files deleted successfully');
    //     })
    //     .catch(error => {
    //         console.error('Error deleting files:', error);
    //     });
    //     return res.status(403).json({
    //         error: 'Вы не являетесь автором задачи'
    //     });
    // }
    // if (res.locals.multerError) {
    //     delpdf(filePaths)
    //     .then(() => {
    //         console.log('Files deleted successfully');
    //     })
    //     .catch(error => {
    //         console.error('Error deleting files:', error);
    //     });
    //     res.status(500).json(res.locals.multerError);
    // }

    db.Subtasks.create({
        name: req.body.name,
        description: req.body.description,
        statusUUID: "cabd88f8-a9a3-11ef-af6a-3cecef0f521e", // Назначено
        taskUUID: taskUUID,
    })
    .then(new_subtask => {
        res.status(200).send();
    })
    .catch((err) => {
        res.status(500).json(err.message);
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