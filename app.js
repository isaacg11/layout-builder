const express = require('express');
const session = require("express-session");
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const app = express();

// db config
const dbConfig = { 
    useNewUrlParser: true, 
    useUnifiedTopology: true
}

// serve client
if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));
}

// db connection
mongoose.connect(
    'mongodb+srv://isaac:kaHani745@cluster0.s06wdno.mongodb.net/layout-app?retryWrites=true&w=majority', 
    dbConfig
)

// db models
require('./models/layout');
require('./models/user');

// api directories
const layouts = require('./api/layouts');
const users = require('./api/users');

// middleware
app.use(session({
    secret : 'foo',
    cookie : {
        expires: false,
        domain: 'http://localhost:3000'
    },
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true,
    secure: true,
    ephemeral: true,
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser('foo'));
app.use(passport.initialize());
app.use(passport.session());

// API endpoints (v.1.0)
app.use('/api/v1/layouts', layouts);
app.use('/api/v1/users', users);

// serve index.html
if(process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname + '/client/build/index.html'))
    });
}

// server config
const port = process.env.PORT || 5000;

console.log(`App listening on port ${port}`);
app.listen(port);

module.exports = app;