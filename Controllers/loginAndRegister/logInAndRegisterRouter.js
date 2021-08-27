const logIn = require('./login')
const register = require('./register')
const verifyUser = require('./verifyUser')
const resetPassword = require('./resetPassword')
const sendResetEmail = require('./sendResetEmail')

const usersRouter = require('express').Router()

usersRouter.get("/confirmation/:token", verifyUser)
usersRouter.post("/resetpasswordlink", sendResetEmail)
usersRouter.post('/login', logIn)
usersRouter.get("/resetpassword/:token", resetPassword)
usersRouter.post("/register", register)

module.exports = usersRouter