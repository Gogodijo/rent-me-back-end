const mongoose = require('mongoose')
require('dotenv').config()

async function con() { mongoose.connect(process.env.DB_CONNECTION_STRING, 
{useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true  },
(error) => {
    if(error){
        console.log(error)
    console.log("Mongo ei toimi =(")}
    else{
        console.log("Mongo toimii =)")
    }
})};

module.exports = con();