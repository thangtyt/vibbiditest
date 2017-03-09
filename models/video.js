/**
 * Created by thangtyt on 3/9/17.
 */
module.exports = function(sequelize, DataTypes) {
    let video = sequelize.define('video', {
        id : {
            type : DataTypes.BIGINT,
            autoIncrement : true,
            primaryKey : true
        },
        name : {
            type: DataTypes.STRING
        },
        url : {
            type: DataTypes.STRING,
            unique: true
        },
        tagline : DataTypes.STRING,
        artist : DataTypes.STRING,
        genre_id : DataTypes.BIGINT,
        collection_id : DataTypes.BIGINT,
        user_id : DataTypes.BIGINT

    });
    return video;
};