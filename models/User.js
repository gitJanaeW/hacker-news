const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

// user class that borrows all functionality from sequelize's Model class
class User extends Model {}

// method to define table columns and configuration
User.init(
    {
        // table columns definitions
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // means the password must be at least 4 chars long
                len: [4]
            }
        }
    },
    {
        // table configuration options belows
        sequelize,
        // don't automaticaly create createdAt/updatedAt timestamp fields
        timestamps:false,
        // don't pluralize nae of database table
        freezeTableName: true,
        // use underscores instead of camel-casing
        underscored: true,
        // make it so our model name stays lowercase in the db
        modelName: 'user'
    }
);

module.exports = User;