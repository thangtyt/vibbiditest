'use strict';
let express = require('express');
let router = express.Router();
let db = require('../sequelize');
/* GET users listing. */
//list collection of user
router.get('/listCollections', function(req, res, next) {
    listCollections(req,res)
});
router.get('/listCollections/page/:page', function(req, res, next) {
    listCollections(req,res)
});
//list video of user
router.get('/listVideos', function(req, res, next) {
    listVideos(req,res)
});
router.get('/listVideos/page/:page', function(req, res, next) {
    listVideos(req,res)
});
router.get('/listVideos(/page/:page)?/:collection_id', function(req, res, next) {
    listVideos(req,res)
});
function listVideos(req,res){
    let title = 'List all your videos';
    let Models = db.sequelize.models;
    let user = req.session.user;
    let page = req.params.page || 1;
    let itemOfPage = 20;
    let whereData = {
        user_id : user.id
    };
    if (req.params.collection_id){
        whereData.collection_id = req.params.collection_id;
        title = 'List all your videos of ';
    }
    Models.video.findAndCountAll({
        limit: itemOfPage,
        offset: (page - 1) * itemOfPage,
        where: whereData,
        include: [
            {
                model: Models.genre,
                attributes: ['name']
            },
            {
                model: Models.collection,
                attributes: ['name']
            }
        ],
        raw: true
    }).then(function (videos) {
        let totalPage = Math.ceil(videos.count / itemOfPage);
        if (req.params.collection_id){
            title += videos.rows[0]['collection.name'];
        }
        res.render('listVideos',{
            title: title,
            menu : 'list_videos',
            videos: videos.rows,
            totalPage : totalPage,
            totalCount : videos.count,
            itemOfPage : itemOfPage,
            page : page
        })
    })
}
function listCollections(req,res){
    let Models = db.sequelize.models;
    let user = req.session.user;
    let page = req.params.page || 1;
    let itemOfPage = 20;
    let whereData = {
        user_id : user.id
    };
    Models.collection.findAndCountAll({
        limit: itemOfPage,
        offset: (page - 1) * itemOfPage,
        where: whereData,
        include: [
            {
                model: Models.genre,
                attributes: ['name']
            }
        ],
        raw: true
    }).then(function (collections) {
        console.log(collections);
        let totalPage = Math.ceil(collections.count / itemOfPage);
        res.render('listCollections',{
            title: 'List all your collection',
            menu : 'list_collections',
            collections: collections.rows,
            totalPage : totalPage,
            totalCount : collections.count,
            itemOfPage : itemOfPage,
            page : page
        })
    })
}
module.exports = router;
