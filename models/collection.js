/**
 * Created by thangtyt on 3/9/17.
 */
module.exports = function(sequelize, DataTypes) {
    let collection = sequelize.define('collection', {
        id : {
            type : DataTypes.BIGINT,
            autoIncrement : true,
            primaryKey : true
        },
        name : {
            type: DataTypes.STRING,
            unique: true
        },
        genre_id : DataTypes.BIGINT,
        desc: DataTypes.TEXT,
        user_id : DataTypes.BIGINT
    });
    return collection;
};