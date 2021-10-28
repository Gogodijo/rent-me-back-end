const User = require('../../Models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
  })

}

module.exports = logIn