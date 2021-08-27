const User = require('../../Models/user')
const jwt = require('jsonwebtoken')
const mailer = require('../../utils/mailer/mailer')
require('dotenv').config()

const sendResetEmail = async (req, res) => {
  const email = req.body.email
  const user = await User.findOne({ email: email })
  if (user) {
    jwt.sign(email, process.env.PASSWORD_RESET_SECRET, (err, token) => {
      const url = `${process.env.FRONT_END_BASE_URL}/resetpassword/${token}`
      mailer.sendResetEmail(user.email, url).then(() => {
        res.status(200).json({
          message: "Reset link sent"
        })
      }).catch( err => {
        res.status(503).json({
          message: "Cannot send email"
        })
      })
    })
  }
  else {
    res.status(500).json({
      message: "Invalid email"
    })
  }
}

module.exports = sendResetEmail