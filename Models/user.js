const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email: String,
    firstName: String,
    lastName: String,

    address: {
      type:String,
      default:''
    },
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
    refresh_token: {
        type:String,
        default: ""
    },
    avatar_url: {
      type:String,
      default: ""
    },
    
    contactPersonFor: {type: mongoose.Schema.Types.ObjectId, ref: 'Renter', default:""}
    
}, {timestamps:true})

UserSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString(),
    delete returnedObject.isVerified,
    delete returnedObject.password,
    delete returnedObject.isAdmin
  }
})

const User = mongoose.model('User', UserSchema)

module.exports = User