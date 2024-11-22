module.exports = (client, Sequelize, DataTypes) => {
    const Table = client.define("Profiles", {
        UUID: {
            type:           DataTypes.UUID,
            primaryKey:     true,
            unique:         true,
            allowNull:      false,
            defaultValue:   Sequelize.UUIDV4,
        },
        firstName: {
            type:           DataTypes.STRING,
            unique:         false,
            allowNull:      false,
        },
        lastName: {
            type:           DataTypes.STRING,
            unique:         false,
            allowNull:      false,
        },
        patronymic: {
            type:           DataTypes.STRING,
            unique:         false,
            allowNull:      true,
        },
        email: {
            type:           DataTypes.STRING,
            unique:         false,
            allowNull:      true,
        },
        photoUrl: {
            type:           DataTypes.STRING,
            unique:         false,
            allowNull:      true,
        },
        credentialsUUID: {
            type:           DataTypes.UUID,
            unique:         true,
            allowNull:      false,
        },
    }, {});

    Table.beforeCreate((newObject, options) => {
        if (!newObject.UUID) {
            newObject.UUID = uuidv4();
        }
        if (!newObject.createdAt) {
            newObject.createdAt = new Date();
        }
        if (!newObject.updatedAt) {
            newObject.updatedAt = new Date();
        }
    });

    Table.beforeUpdate((newObject, options) => {
        newObject.updatedAt = new Date();
    });
    
    return Table;
};