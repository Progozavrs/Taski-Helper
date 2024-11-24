const { stringify } = require('uuid');
const db = require('../../database/index');
const delpdf = require('./variousHandlers').deleteUploadedPdfs;
const mail = require('../mail');

module.exports.createTask = async function (req, res) {
    try {
        const {
            name,
            description,
            deadlineISO,
            groupUUID
        } = req.body;
    
        // const group = await db.Groups.findOne({
        //     where: {
        //         UUID: groupUUID
        //     },
        //     include: {
        //         attributes: [ 'credentialsUUID' ],
        //         model: db.Invitations,
        //         as: 'groupInvitations',
        //         include: [{
        //             model: db.Credentials,
        //             as: 'invitationUser',
        //             include: {
        //                 attributes: [ 'email' ],
        //                 model: db.Profiles,
        //                 as: 'userProfile',
        //             }
        //         }, {
        //             model: db.Accesses,
        //             as: 'invitationAccess',
        //         }]
        //     }
        // })
    
        // const filePaths = req.files?.['file']?.map(file => file.path) || [];
    
        // if (!group) {
        //     delpdf(filePaths)
        //     .then(() => {
        //         console.log('Files deleted successfully');
        //     })
        //     .catch(error => {
        //         console.error('Error deleting files:', error);
        //     });
        //     res.status(404).json('Группа не найдена');
        //     return;
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
        // if (group.groupInvitations[0].invitationAccess.name in ['Только чтение', 'Только выполнение']) {
        //     delpdf(filePaths)
        //     .then(() => {
        //         console.log('Files deleted successfully');
        //     })
        //     .catch(error => {
        //         console.error('Error deleting files:', error);
        //     });
        //     res.status(403).json('У вас недостаточно прав для создания задачи в этой группе');
        //     return;
        // }
    
        const task = await db.Tasks.create({
            name: name,
            description: description,
            deadlineISO: deadlineISO,
            // fileLink: JSON.stringify(filePaths),
            statusUUID: "cabd88f8-a9a3-11ef-af6a-3cecef0f521e", // Назначено
            authorUUID: res.locals.UUID,
            groupUUID: groupUUID
        })
        const author = await task.getTaskAuthor({
            attributes: [ 'UUID' ],
            include: {
                model: db.Profiles,
                as: 'userProfile'
            }
        });
        const status = await task.getTaskStatus();

        const emails = [group.groupInvitations.map(invitation => invitation.invitationUser.userProfile?.email)];
        if (emails[0]) {
            const transporter = mail.transporter;
            const mailOptions = {
                from: mail.config.from,
                to: emails,
                subject: `Создана новая задача "${name}"`,
                text: `Задача "${name}" была создана пользователем ${author.userProfile.lastName} ${author.userProfile.firstName} в группе ${group.name}.`,
                html: `<h1>Создана новая задача "${name}"</h1>
                    <p>Задача "${name}" была создана пользователем ${author.userProfile.lastName} ${author.userProfile.firstName} в группе ${group.name}.</p>`
            }
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Message sent: %s', info.messageId);
                }
            });
        }
        res.status(201).json({
            ...task.dataValues,
            taskAuthor: author,
            taskStatus: status
        });
    }
    catch (err) {
        res.status(500).json(err.message);
    };
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
                as: 'taskGroup',
            }
        ]
    })
    .then(tasks => {
        res.status(200).json(tasks);
    })
    .catch(err => {
        res.status(500).json(err.message);
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
            },
        ]
    })
    .then(tasks => {
        res.status(200).json(tasks);
    })
    .catch(err => {
        res.status(500).json(err.message);
    });
}

module.exports.attachFile = async function (req, res) {
    try {
        const { taskUUID } = req.params;

        // Получаем данные задачи из базы данных
        const task = await db.Tasks.findOne({
            where: { 
                UUID: taskUUID 
            }
        });

        const newFilePaths = req.files?.['file']?.map(file => file.path) || [];

        if (!task) {
            delpdf(newFilePaths)
            .then(() => {
                console.log('Files deleted successfully');
            })
            .catch(error => {
                console.error('Error deleting files:', error);
            });
            return res.status(404).json({ message: 'Задача не найдена' });
        }
        if (task.credentialsUUID !== res.locals.UUID) {
            delpdf(newFilePaths)
            .then(() => {
                console.log('Files deleted successfully');
            })
            .catch(error => {
                console.error('Error deleting files:', error);
            });
            return res.status(403).json({ message: 'У вас недостаточно прав для обновления этой задачи' });
        }
        if (res.locals.multerError) {
            delpdf(newFilePaths)
            .then(() => {
                console.log('Files deleted successfully');
            })
            .catch(error => {
                console.error('Error deleting files:', error);
            });
            res.status(500).json(res.locals.multerError);
        }

        const existingFilePaths = JSON.parse(task.fileLink) || [];

        if (existingFilePaths.length + newFilePaths.length > 5) {
            await delpdf(newFilePaths);
            return res.status(400).json({ 
                error: 'Общее количество файлов не должно превышать 5' 
            });
        }
        
        const allFilePaths = existingFilePaths.concat(newFilePaths);
        const filePaths = stringify(allFilePaths);

        await db.Tasks.update({
            fileLink: filePaths
        }, {
            where: { 
                UUID: taskUUID 
            }
        })

        res.status(200).json({ 
            filePaths 
        });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports.changeTask = function (req, res) {
    const { taskUUID } = req.params;

    db.Tasks.findOne({
        where: {
            UUID: taskUUID
        },
        include: {
            model: db.Groups,
            as: 'taskGroup', 
            include: {
                model: db.Invitations,
                as: 'groupInvitations',
                where: {
                    credentialsUUID: res.locals.UUID
                }, 
                include: {
                    model: db.Accesses,
                    as: 'invitationAccess'
                }
            }
        }
    })
    .then(task => {
        if (!task) {
            res.status(404).json('Задача не найдена');
            return;
        }
        if (task.authorUUID != res.locals.UUID) {
            if (task.taskGroup.groupInvitations.length === 0) {
                res.status(403).json('У вас недостаточно прав на редактирование');
                return;
            }
            if (task.taskGroup.groupInvitations[0].invitationAccess.name === 'Только чтение') {
                res.status(403).json('У вас недостаточно прав на редактирование');
                return;
            }
            if (task.taskGroup.groupInvitations[0].invitationAccess.name === 'Только выполнение') {
                db.Tasks.update({
                    statusUUID: req.body.statusUUID
                }, {
                    where: {
                        UUID: taskUUID,
                    }
                })
                .then(() => {
                    res.status(200).json('Статус задачи изменен');
                })
                .catch(err => {
                    res.status(500).json(err.message);
                });
            }
            if (task.taskGroup.groupInvitations[0].invitationAccess.name === 'Полный доступ') {
                db.Tasks.update({
                    name: req.body.name,
                    description: req.body.description,
                    deadlineISO: req.body.deadlineISO,
                    statusUUID: req.body.statusUUID,
                }, {
                    where: {
                        UUID: taskUUID
                    }
                })
                .then(() => {
                    res.status(200).json('Задача изменена');
                })
                .catch(err => {
                    res.status(500).json(err.message);
                });
            }
        }
    })
    .catch(err => {
        res.status(500).json(err.message);
    })
}