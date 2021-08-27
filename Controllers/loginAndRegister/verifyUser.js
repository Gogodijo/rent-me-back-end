const User = require('../../Models/user')
const jwt = require('jsonwebtoken')


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

module.exports = verifyUser