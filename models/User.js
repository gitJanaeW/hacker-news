const bcrypt = require('bcrypt');
const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

// user class that borrows all functionality from sequelize's Model class
class User extends Model {
    // instance method to check that individual User object in question (ie. this) has a password that matches
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}

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
        username: {
            type: DataTypes.STRING,
            allowNull: false
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
        // function(s) to run before or after Sequelize functions are called 'hooks'
        hooks: {
            // beforeCreate: before sequelizer handles the data from browswer, perform this function
            async beforeCreate(newUserData) {
                // asynchronously wait on newUserData.password to be encrypted with 10 chars
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                // with encrypted password, return data back to sequelizer
                return newUserData;
            },
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
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