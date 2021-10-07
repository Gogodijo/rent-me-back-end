const User = require('../../Models/user')
const jwt = require('jsonwebtoken')
const mailer = require('../../utils/mailer/mailer')
const bcrypt = require('bcrypt')

const invalidRegisterInfo = (email, name, password) => {

}


const register = async (req, res, next) => {
  const { email,firstName, lastName, password } = req.body
  if (!email || !firstName || !lastName || !password) {
    res.status(400).json({ message: "Invalid data" })
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
      email,
      firstName,
      lastName,
      password: hashedPasword,
      refresh_token: refreshToken
    })
    savedUser = await user.save()
    if (savedUser) {
      jwt.sign({ user_email: user.email },
        process.env.EMAIL_SECRET,
        { expiresIn: "7d" },  (err, token) => {
          if (!err) {
           const url = `${process.env.FRONT_END_BASE_URL}/confirm/${token}`
            mailer.sendRegisterMail(user.email, url).then(() => {
                          res.status(200).json({
              message: "Registeration complete"
            })
            }).catch(async err => {
              res.status(500).json({
                message:"Could not send registeration email"
              })
               await User.findOneAndDelete({email})

            })
          }
          else {
            next(err)
            return
          }
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
    res.status(500).json({
      message: "Something went wrong with resigisteration"
    })
  }
}

module.exports = register