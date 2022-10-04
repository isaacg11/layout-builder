const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = mongoose.model('User');
const { localLogin } = require('../middleware/index');

// SIGNUP
router.post('/signup', ((req, res) => {
    User.findOne({ email: req.body.user.email }).then(user => {
        if (user) return res.sendStatus(403);
        let newUser = new User(req.body.user);
        newUser.setPassword(req.body.password);
        newUser.save((err, u) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            } else {
                res.json({
                    token: newUser.generateJWT(),
                    user: u
                })
            }
        })
    })
}))

// LOGIN
router.post('/login', localLogin, ((req, res) => {
    const session = req.user._doc
    User.findById(session._id, (err, user) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            res.json({
                token: req.user.generateJWT(),
                user: session
            });
        }
    })
}))

module.exports = router;