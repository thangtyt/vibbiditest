'use strict';
let express = require('express');
let router = express.Router();
let formidable = require('formidable');
let parse = require('csv-parse');
let fs = require('fs');
let db = require('../sequelize');
let _ = require('lodash');
let Promise = require('bluebird');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Import File CSV',menu: 'import' });
});
router.post('/uploadFile', function (req,res) {
    let form = new formidable.IncomingForm();
    let Models = db.sequelize.models;
    let user = req.session.user;
    let data = {
        genre : [],
        collection : [],
        video : []
    };
    let genre = [];
    let collection = [];
    form.parse(req, function(err, fields, files) {
        fs.createReadStream(files.file.path)
            .pipe(parse({
                auto_parse: true, // Ensures that numeric values remain numeric
                //columns: true,
                delimiter: ',',
                quote: '',
                trim: true,
                from : 2,
                relax: true,
                relax_column_count: true,
                //rowDelimiter: '\n', // This is an issue, I had to set the \n here as 'auto' wasn't working, nor was 'windows'.  Maybe look at auto-detecting line endings?
                skip_empty_lines: true
            }))
            .on('data', function (row) {
                if (genre.indexOf(row[2])  < 0){
                    genre.push(row[2]);
                    data.genre.push({
                        name : row[2]
                    })
                }
                if (collection.indexOf(row[3])  < 0){
                    collection.push(row[3]);
                    data.collection.push({
                        name : row[3],
                        genre_id : row[2],
                        user_id : user.id
                    })
                }
                data.video.push({
                    name : row[7],
                    url : row[10],
                    tagline : row[13],
                    artist : row[6],
                    genre_id : row[2],
                    collection_id : row[3],
                    user_id : user.id
                });
            })
            .on('error', function () {
                res.sendStatus(400);
            })
            .on('end', function () {
                //delete temp file
                fs.unlink(files.file.path, function () {});

                Models.genre.bulkCreate(data.genre,{ignoreDuplicates:true})
                    .then(function () {
                        return  Models.genre.findAll({
                            attributes : ['id','name'],
                            raw : true
                        })
                    })
                    .then(function (_genres) {
                        genre = _genres;
                        data.collection.filter(function (_collection) {
                            _collection.genre_id = getId(genre,_collection.genre_id);
                            return _collection;
                        });
                        return Models.collection.bulkCreate(data.collection,{ignoreDuplicates: true});
                    })
                    .then(function () {
                        return Models.collection.findAll({
                            where : {
                                user_id : user.id
                            },
                            attributes: ['id','name'],
                            raw : true
                        });
                    })
                    .then(function (_colllections) {
                        data.video.filter(function (_obj) {
                            _obj.genre_id = getId(genre,_obj.genre_id);
                            _obj.collection_id = getId(_colllections,_obj.collection_id);
                             return _obj;
                        });
                        return Models.video.bulkCreate(data.video,{ignoreDuplicates: true});
                    }).then(function () {
                        res.sendStatus(200);
                    })
                    .catch(function (err) {
                        res.sendStatus(400);
                    })
            });
    });

});
function getId(obj,stringName,key){
    let id = null;
    obj.map(function (_obj) {
        if (_obj.name === stringName){
            id = _obj.id;
        }
    });
    return id;
}
module.exports = router;

