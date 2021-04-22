const express = require('express')
require('dotenv').config()
const app = express()
app.use(express.json())
const cors = require('cors')
const middleware = require('./utils/middleware')
const mongo = require('./database')
const usersRouter = require('./Controllers/logInAndRegister')

app.use(cors())
app.use(express.static('build'))

app.get("/ping", (req,res) => {
  res.json({status:true, msg:'pong'})
})

app.use('/api/user', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app