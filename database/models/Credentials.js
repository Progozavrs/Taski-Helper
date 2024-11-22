module.exports = (client, Sequelize, DataTypes) => {
    const Table = client.define("Credentials", {
        UUID: {
            type:           DataTypes.UUID,
            primaryKey:     true,
            unique:         true,
            allowNull:      false,
            defaultValue:   Sequelize.UUIDV4,
        },
        telegramID: {
            type:           DataTypes.STRING,
            unique:         true,
            allowNull:      true,
        },
        vkID: {
            type:           DataTypes.STRING,
            unique:         true,
            allowNull:      true,
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