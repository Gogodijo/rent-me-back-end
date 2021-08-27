const jwt = require('jsonwebtoken')
const User = require('../Models/user')

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
          jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "5min" }, (err, token) => {
            res.status(200).json({
              token: token
            })
          })
        }
        else {
            res.status(500).json({message:"Something went wrong with server"})
        }
      }
    })
  } else {
    res.sendStatus(403).json({
      message: "Error refreshing token"
    })
  }
}

module.exports = refresh