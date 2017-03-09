/**
 * Created by thangtyt on 3/6/17.
 */
    'use strict';
let express = require('express');
let router = express.Router();
let db = require('../sequelize');

router.get('/', function(req, res, next) {
    res.render('login', { title: 'Login Page' });
});
router.post('/', function (req,res) {
    let form = req.body;
    db.sequelize.models.users.find({
        attributes: ['id','email','full_name'],
        where: {
            email: form.email,
            password: form.password
        },
        raw:true
    }).then(function (user) {
        if (user){
            req.session.user = user;
            res.status(200).redirect('/');
        }else{
            res.render('login',{
                error: 'Not found user please login by another user !'
            })
        }
    }).catch(function (err) {
        res.render('login',{
            error: err.message
        })
    })
})
module.exports = router;