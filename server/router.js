"use strict";

const UsersModel = require('./models/usersModel');
const _ = require('lodash');
const config = require('./config');
const bcrypt = require('bcryptjs');
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

function checkAuth (req, res, next) {
    passport.authenticate('jwt', { session: false }, (err, decryptToken, jwtError) => {
        if(jwtError != void(0) || err != void(0)) return res.render('index.html', { error: err || jwtError});
        // console.log(decryptToken);
        req.user = decryptToken;
        next();
    })(req, res, next);
}

function createToken (body) {
    return jwt.sign(
        body,
        config.jwt.secretOrKey,
        {expiresIn: config.expiresIn}
    );
}

module.exports = app => {
    app.use('/assets', express.static('./public'));

    app.get('/', (req, res) => {
        // res.cookie('username', req.user.username);
        // res.render('index.html', { username: req.user.username });
        res.json('Hello api');
    });
    /*app.get('/private', checkAuth, (req, res) => {
        res.cookie('username', req.user.username);
        res.cookie('id', req.user.id);
        UsersModel.find({}).exec((err, users) => {
            if (err) console.error('Error in rinding users for private chat', err);
            // console.log(users);
            res.render('private.html', { username: req.user.username, users: users });
        });
    });*/

    app.post('/login', async (req, res) => {
        try {
            let user = await UsersModel.findOne({username: {$regex: _.escapeRegExp(req.body.username), $options: "i"}}).lean().exec();
            if(user != void(0) && bcrypt.compareSync(req.body.password, user.password)) {
                const token = createToken({id: user._id, username: user.username});
                res.cookie('token', token, {
                    httpOnly: true
                });

                res.status(200).send({message: "User login success."});
            } else res.status(400).send({message: "User not exist or password not correct"});
        } catch (e) {
            console.error("E, login,", e);
            res.status(500).send({message: "some error"});
        }
    });

    /*app.post('/register', async (req, res) => {
        try {
            let user = await UsersModel.findOne({username: {$regex: _.escapeRegExp(req.body.username), $options: "i"}}).lean().exec();
            if(user != void(0)) return res.status(400).send({message: "User already exist"});

            user = await UsersModel.create({
                username: req.body.username,
                password: req.body.password
            });

            const token = createToken({id: user._id, username: user.username});

            res.cookie('token', token, {
                httpOnly: true
            });

            res.status(200).send({message: "User created."});

        } catch (e) {
            console.error("E, register,", e);
            res.status(500).send({message: "some error"});
        }
    });*/

   /* app.post('/logout', (req, res) => {
        res.clearCookie('token');
        res.status(200).send({message: "Logout success."});
    });*/
};