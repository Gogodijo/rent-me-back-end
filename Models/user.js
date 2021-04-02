const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email: String,
    name: String,
    password: {
        type:String,
        default:""
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isLoggedIn: {
        type:Boolean,
        default: false
    },
    refresh_token: {
        type:String,
        default: ""
    }
})

const User = mongoose.model('User', UserSchema)

module.exports = User