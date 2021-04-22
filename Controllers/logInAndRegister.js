const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../Models/user')
const nodemailer = require('nodemailer')
const usersRouter = require('express').Router()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})


const logIn = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email: email })
  if (!user) {
    res.status(401).json({
      message: "Wrong email or password"
    })
    return
  }
  if (!user.isVerified) {
    res.status(401).json({
      message: "Please verify your email adress"
    })
    return
  }
  bcrypt.compare(password, user.password, (err, same) => {
    if (err) {
      res.status(500).json({
        message: "Something went wrong with the server"
      })
      return
    }
    if (!same) {
      res.status(401).json({
        message: "Wrong email or password"
      })
      return
    }
    jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "30s" }, (err, token) => {
      if (err) {
        res.status(500).json({
          message: "Something went wrong with the server"
        })
        return
      }
      res.status(200).json({
        user: user,
        acess_token: token,
      })
      return
    })
  })

}

const register = async (req, res) => {
  console.log("Register")
  const { email, name, password } = req.body
  if(!email || !name || !password){
    res.status(400).json({message:"Invalid data"})
    return
  }
  if (await User.findOne({ email: email })) {
    res.status(422).json({
      message: "Email already in use"
    })
    return
  }
  try {
    const hashedPasword = await bcrypt.hash(password, 10)
    const refreshToken = jwt.sign({ email: email }, process.env.REFRESH_TOKEN_SECRET)
    const user = new User({
      email: email,
      name: name,
      password: hashedPasword,
      refresh_token: refreshToken
    })
    savedUser = await user.save()
    if (savedUser) {
      jwt.sign({ user_email: user.email },
        process.env.EMAIL_SECRET,
        { expiresIn: "7d" }, (err, token) => {
          if (!err) {
            const url = "http://localhost:3000/confirm/" + token
            transporter.sendMail({
              to: user.email,
              subject: "Confirm your email adress",
              html: "Please click this link to confirm your email <a href=\"" + url + "\">Link</a>"
            }, (error, info) => {
              if (error) {
                console.error(error)
              }
            })
          }
          else {
            return
          }
        })
      res.status(200).json({
        message: "Registeration complete"
      })
    }
    else {
      res.status(500).json({
        message: "Something went wrong with resigisteration"
      })
    }
  }
  catch (err) {
    console.log(err)
  }
}



const verifyUser = async (req, res) => {
  try {
    console.log(req.params.token)
    const jwtToken = jwt.verify(req.params.token, process.env.EMAIL_SECRET)
    const email = jwtToken.user_email
    const user = await User.findOneAndUpdate({ email: email }, { isVerified: true })
    if(!user){
      res.status(404).end()
      return
    }
    res.status(200).json({
      message: "You have verified your email adress. You can now log in"
    })
  }
  catch {
    res.status(500).json({
      message: "Could not verify user"
    })
  }
}


const resetPassword = async (req, res) => {
  try {
    const email = jwt.verify(req.params.token, process.env.PASSWORD_RESET_SECRET)
    const hashedPasword = await bcrypt.hash(req.body.password, 10)
    const refreshToken = jwt.sign({ email: email }, process.env.REFRESH_TOKEN_SECRT)
    const user = await User.findOneAndUpdate({ email: email }, { password: hashedPasword, refresh_token: refreshToken })
    if (user) {
      res.status(200).json({
        message: "Password reseted"
      })
    }
  }
  catch {
    res.status(500).json({
      message: "Error resetting password"
    })
  }
}


const sendResetEmail = async (req, res) => {
  const email = req.body.email
  const user = await User.findOne({ email: email })
  if (user) {
    jwt.sign(email, process.env.PASSWORD_RESET_SECRET, (err, token) => {
      url = "http://localhost:3000/resetpassword/" + token
      transporter.sendMail({
        to: user.email,
        subject: "Reset password",
        html: "Reset your password via this <a href=\"" + url + "\">Link</a>"
      }, (error, info) => {
        if (error) {
          console.log(error)
        }
        else {
          console.log(info)
        }
      })
    })
    res.status(200).json({
      message: "Reset link sent"
    })
  }
  else {
    res.status(500).json({
      message: "Invalid email"
    })
  }
}



const refresh = async (req, res) => {
  let refresh_token = req.body.token
  const bearerHeader = req.headers['authorization']
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]
    jwt.verify(bearerToken, process.env.JWT_SECRET, async (err, decoded) => {
      if (err.name == "TokenExpiredError") {
        const decoded = jwt.decode(bearerToken)
        const user = await User.findOne({ email: decoded.email })
        if (user.refresh_token == refresh_token) {
          jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "30s" }, (err, token) => {
            res.status(200).json({
              token: token
            })
          })
        }
        else {

        }
      }
    })
  } else {
    res.sendStatus(403).json({
      message: "Error refreshing token"
    })
  }
}
usersRouter.get("/confirmation/:token", verifyUser)
usersRouter.post("/resetpasswordlink", sendResetEmail)
usersRouter.post('/login', logIn)
usersRouter.post('/refresh', refresh)
usersRouter.get("/resetpassword/:token", resetPassword)
usersRouter.post("/register", register)

module.exports = usersRouter