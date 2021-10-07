const User = require('../../Models/user')
const { OAuth2Client } = require('google-auth-library')
const jwt = require('jsonwebtoken')

const client = new OAuth2Client(process.env.CLIENT_ID)

const loginGoogle = async (req, res, next) => {

  const { token } = req.body

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID
  })
  const ticketPayload = ticket.getPayload()
  console.log(ticketPayload.email)

  const user = await User.findOne({ email: ticketPayload.email })
  console.log(user)

  //If there is user And it has password that means that user was registered normally. Means that we cannot let them use google sign in
  if (user && user.password) {
    res.status(409).json({ message: "You already have normal account" })
    return
  }

  //If there is no user we can create one with google login info and send tokens back to log them in
  if (!user) {
    const refreshToken = jwt.sign({ email: ticketPayload.email }, process.env.REFRESH_TOKEN_SECRET)
    const user = new User({
      email: ticketPayload.email,
      firstName: ticketPayload.given_name,
      lastName: ticketPayload.family_name,
      refreshToken: refreshToken,
      isVerified: true
    })
    //Make sure that user is saved into the database, otherwise just error out
    const savedUser = await user.save()
    jwt.sign({ email: savedUser.email }, process.env.JWT_SECRET, { expiresIn: "5min" }, (err, token) => {
      if (err) {
        res.status(500).json({
          message: "Something went wrong with the server"
        })
        return
      }
      res.status(200).json({
        user: savedUser,
        acess_token: token,
        refresh_token: savedUser.refresh_token
      })
      return
    })
  }
  //If user exists and it does not have password it means that the user was created with google login.
  //So we check if info has changed and update user info.
  if (user && !user.password) {
    if (user.firstName !== ticketPayload.given_name || user.lastName !== ticketPayload.family_name) {
      user.firstName = ticketPayload.given_name
      user.lastName = ticketPayload.family_name
      await user.save()
    }
    jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "5min" }, (err, token) => {
      if (err) {
        res.status(500).json({
          message: "Something went wrong with the server"
        })
        return
      }
      res.status(200).json({
        user: user,
        acess_token: token,
        refresh_token: user.refresh_token
      })
      return
    })
  }

}

module.exports = loginGoogle