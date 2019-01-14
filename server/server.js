"use strict";

const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const ethUtil = require('ethereumjs-util');


//підключення до БД
mongoose.connect('mongodb://localhost:27017/my-metamask', { useNewUrlParser: true });
mongoose.Promise = require('bluebird');
// mongoose.set('debug', true);

const app = express();
// const server = require('http').Server(app);
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// CORS middleware
const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
};

app.use(allowCrossDomain);


router.post('/check-sign', (req, res) => {

    let signature = req.body.signature;
    let publicAddress = req.body.coinbase;
    let msg = req.body.msg;
    // console.log(signature);
    // console.log(publicAddress);

    const msgBuffer = ethUtil.toBuffer(msg);
    const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
    const signatureBuffer = ethUtil.toBuffer(signature);
    const signatureParams = ethUtil.fromRpcSig(signatureBuffer);
    const publicKey = ethUtil.ecrecover(
        msgHash,
        signatureParams.v,
        signatureParams.r,
        signatureParams.s
    );
    const addressBuffer = ethUtil.publicToAddress(publicKey);
    const address = ethUtil.bufferToHex(addressBuffer);

    if (address.toLowerCase() === publicAddress.toLowerCase()) {
        let token = jwt.sign({ id: 1}, config.secret, {expiresIn: 86400 });
        res.json({token: token});
    } else {
        return res
            .status(401)
            .send({ error: 'Signature verification failed' });
    }

});

app.use(router);

let port = 3000;

let server = app.listen(port, function() {
    console.log('Express server listening on port ' + port)
});