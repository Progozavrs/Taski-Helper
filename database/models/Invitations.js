module.exports = (client, Sequelize, DataTypes) => {
    const Table = client.define("Invitations", {
        UUID: {
            type:           DataTypes.UUID,
            primaryKey:     true,
            unique:         true,
            allowNull:      false,
            defaultValue:   Sequelize.UUIDV4,
        },
        groupUUID: {
            type:           DataTypes.UUID,
            unique:         false,
            allowNull:      false,
        },
        credentialsUUID: {
            type:           DataTypes.UUID,
            unique:         false,
            allowNull:      false,
        },
        accessUUID: {
            type:           DataTypes.UUID,
            unique:         false,
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