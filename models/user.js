const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    passwordHash: {
        type: Object
    },
    salt: {
        type: Object
    },
    dt_created: {
        type: Date,
        default: new Date()
    },
    dt_deleted: {
        type: Date,
        default: null
    }
});

UserSchema.method("setPassword", function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
});

UserSchema.method("validatePassword", function (password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
    return (hash === this.passwordHash);
});

UserSchema.method("generateJWT", function () {
    return jwt.sign({
        id: this._id,
        email: this.email,
        full_name: this.full_name,
        type: this.type
    }, 'foo');
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
