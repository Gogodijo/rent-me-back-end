const logIn = require('./login')
const register = require('./register')
const verifyUser = require('./verifyUser')
const resetPassword = require('./resetPassword')
const sendResetEmail = require('./sendResetEmail')
const loginGoogle = require('./loginGoogle')
const usersRouter = require('express').Router()

usersRouter.get("/confirmation/:token", verifyUser)
usersRouter.post("/resetpasswordlink", sendResetEmail)
usersRouter.post('/login', logIn)
usersRouter.get("/resetpassword/:token", resetPassword)
usersRouter.post("/register", register)
usersRouter.post('/loginGoogle', loginGoogle)

module.exports = usersRouter