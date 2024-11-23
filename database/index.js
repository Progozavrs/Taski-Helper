// Подключаем Sequelize
const db_conf = require('./dbconfig');
const {Sequelize, Op, DataTypes} = require('sequelize');

// Создаем объект Sequelize, настраиваем его
const client = new Sequelize(db_conf.DB, db_conf.USER, db_conf.PASSWORD, {
    host: db_conf.HOST,
    port: db_conf.PORT,
    dialect: db_conf.DIALECT,
    define: {
        timestamps: true,
    },
});
const db = {};
db.Sequelize = Sequelize;
db.Op = Op;
db.DataTypes = DataTypes;
db.client = client;

// Импортируем модели из папки ./models
db.Credentials = require("./models/Credentials") (client, Sequelize, DataTypes);
db.Statuses = require("./models/Statuses") (client, Sequelize, DataTypes);
db.Accesses = require("./models/Accesses") (client, Sequelize, DataTypes);

db.Profiles = require("./models/Profiles") (client, Sequelize, DataTypes);
db.Groups = require("./models/Groups") (client, Sequelize, DataTypes);

db.Tasks = require("./models/Tasks") (client, Sequelize, DataTypes);
db.Invitations = require("./models/Invitations") (client, Sequelize, DataTypes);

db.Subtasks = require("./models/Subtasks") (client, Sequelize, DataTypes);

// Связываем модели между собой

// Profiles
db.Credentials.hasOne(db.Profiles, {
    foreignKey: 'credentialsUUID',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as: 'userProfile'
});
db.Profiles.belongsTo(db.Credentials, {
    foreignKey: 'credentialsUUID',
    as: 'userCredentials'
});
// Groups
db.Credentials.hasMany(db.Groups, {
    foreignKey: 'credentialsUUID',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as: 'userGroups'
});
db.Groups.belongsTo(db.Credentials, {
    foreignKey: 'credentialsUUID',
    as: 'groupOwner'
});
// Tasks
db.Statuses.hasMany(db.Tasks, {
    foreignKey: 'statusUUID',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as: 'statusTasks'
});
db.Tasks.belongsTo(db.Statuses, {
    foreignKey: 'statusUUID',
    as: 'taskStatus'
});
db.Credentials.hasMany(db.Tasks, {
    foreignKey: 'authorUUID',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as: 'userTasks'
});
db.Tasks.belongsTo(db.Credentials, {
    foreignKey: 'authorUUID',
    as: "taskAuthor"
});
db.Groups.hasMany(db.Tasks, {
    foreignKey: 'groupUUID',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as: 'groupTasks'
});
db.Tasks.belongsTo(db.Groups, {
    foreignKey: 'groupUUID',
    as: 'taskGroup'
});
// Invitations
db.Groups.hasMany(db.Invitations, {
    foreignKey: 'groupUUID',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as: 'groupInvitations'
});
db.Invitations.belongsTo(db.Groups, {
    foreignKey: 'groupUUID',
    as: 'invitationGroup'
});
db.Credentials.hasMany(db.Invitations, {
    foreignKey: 'credentialsUUID',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as: 'userInvitations'
});
db.Invitations.belongsTo(db.Credentials, {
    foreignKey: 'credentialsUUID',
    as: 'invitationUser'
});
db.Accesses.hasMany(db.Invitations, {
    foreignKey: 'accessUUID',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as: 'accessInvitations'
});
db.Invitations.belongsTo(db.Accesses, {
    foreignKey: 'accessUUID',
    as: 'invitationAccess'
});
// Subtasks
db.Statuses.hasMany(db.Subtasks, {
    foreignKey: 'statusUUID',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as: 'statusSubtasks'
});
db.Subtasks.belongsTo(db.Statuses, {
    foreignKey: 'statusUUID',
    as: 'subtaskStatus'
});
db.Tasks.hasMany(db.Subtasks, {
    foreignKey: 'taskUUID',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    as: 'taskSubtasks'
});
db.Subtasks.belongsTo(db.Tasks, {
    foreignKey: 'taskUUID',
    as: 'parentTask'
});


module.exports = db