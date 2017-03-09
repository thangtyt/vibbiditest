/**
 * Created by thangtyt on 3/6/17.
 */
'use strict';
module.exports = function(sequelize, DataTypes) {
    let users = sequelize.define('users', {
        id : {
            type : DataTypes.BIGINT,
            autoIncrement : true,
            primaryKey : true
        },
        full_name : DataTypes.STRING,
        password: DataTypes.STRING,
        email : {
            type: DataTypes.STRING,
            unique: true
        }
    });
    return users;
};