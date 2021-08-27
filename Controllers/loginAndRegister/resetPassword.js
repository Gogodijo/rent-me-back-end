const User = require('../../Models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')



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

module.exports = resetPassword