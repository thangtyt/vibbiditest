/**
 * Created by thangtyt on 3/6/17.
 */
'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var db        = {};

let sequelize = new Sequelize('mysql://sql6162318:ehv5dIYZSM@sql6.freesqldatabase.com:3306/sql6162318');

fs.readdirSync(__dirname+'/models')
    .forEach(function(file) {
        var model = sequelize['import'](path.join(__dirname+'/models', file));
        db[model.name] = model;
    });

//associate
db.users.hasMany(db.video,{foreignKey: 'user_id'});
db.genre.hasMany(db.collection,{foreignKey: 'genre_id'});
db.genre.hasMany(db.video,{foreignKey: 'genre_id'});
db.collection.belongsTo(db.genre,{foreignKey: 'genre_id'});
db.collection.belongsTo(db.users,{foreignKey: 'user_id'});
db.video.belongsTo(db.genre,{foreignKey: 'genre_id'});
db.video.belongsTo(db.users,{foreignKey: 'user_id'});
db.collection.hasMany(db.video,{foreignKey: 'collection_id'});
db.video.belongsTo(db.collection,{foreignKey: 'collection_id'});




db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;