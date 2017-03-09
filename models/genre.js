/**
 * Created by thangtyt on 3/9/17.
 */
module.exports = function(sequelize, DataTypes) {
    let genre = sequelize.define('genre', {
        id : {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name : {
            type: DataTypes.STRING,
            unique: true
        },
        desc: DataTypes.TEXT
    });
    return genre;
};