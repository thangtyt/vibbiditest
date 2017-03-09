/**
 * Created by thangtyt on 3/6/17.
 */
    'use strict';
let express = require('express');
let router = express.Router();
let db = require('../sequelize');
router.get('/', function(req, res, next) {
    res.render('Register', { title: 'Register Page' });
});
router.post('/', function (req,res) {
    let form = req.body;
    db.sequelize.models.users.create({
        full_name : form.full_name,
        email: form.email,
        password: form.password
    }).then(function (_newUser) {
        res.render('login',{
            message: "Create successfully ! Please login with new user"
        })
    }).catch(function (err) {
        res.render('register',{
            user : form,
            error: err.message
        });
    })

})
module.exports = router;