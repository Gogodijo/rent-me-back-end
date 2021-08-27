const mongoose = require('mongoose')

const RenterSchema = new mongoose.Schema({

    name: {
      type:String,
      required: true,
      default: ""
    },
    address: {
      type:String,
      default:"",
      required: true
    },
    infoText: {
      type: String,
      default: true
    },
    phoneNumber: {
      type: String
    },
    businessID: {
      type: String
    },

    email: {
      type: String,
      required: true
    },

    contactPersons: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],

    itemsonRent: [{type: mongoose.Schema.Types.ObjectId, ref: 'Item'}]

}, {timestamps: true})

const Renter = mongoose.model('Renter', RenterSchema)

module.exports = Renter

