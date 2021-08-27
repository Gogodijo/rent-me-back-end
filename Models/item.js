const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema({
  name: String,
  info: String,
  price: {
    type: Number,
    required: true,
    default: 0
  },
  imageurls: [{type: String}],
  rentedTimes: [{
    startTime: Date,
    endTime: Date
  }],
  address: {
    type:String,
    default:"",
    required: true
  },
  transportPossible: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

const Item = mongoose.model('Item', ItemSchema)

module.exports = Item