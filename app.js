const express = require('express')
require('express-async-errors');
require('dotenv').config()
const app = express()
app.use(express.json())
const cors = require('cors')
const middleware = require('./utils/middleware')
const mongo = require('./database')
mongo()
const usersRouter = require('./Controllers/loginAndRegister/logInAndRegisterRouter')
const refresh = require('./utils/refresh')

app.use(cors())
app.use(express.static('build'))

app.get("/ping", (req,res) => {
  res.send("pong")
})

app.post('/api/refresh', refresh)
app.use('/api/user', usersRouter)

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)


module.exports = app