const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  pool: true,
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})


const sendRegisterMail = (email, url) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail({
      to: email,
      subject: "Confirm your email adress",
      html: "Please click this link to confirm your email <a href=\"" + url + "\">Link</a>"
    }, (err, info) => {
      if (err) {
        reject(err)
      }
      else {
        resolve()
      }
    })
  })
}

const sendResetEmail = (email, url) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail({
      to: email,
      subject: "Reset password",
      html: "Reset your password via this <a href=\"" + url + "\">Link</a>"
    }, (error, info) => {
      if (error) {
        reject(error)
      }
      else {
        resolve()
      }
    })
  })

}


module.exports = {
  sendRegisterMail,
  sendResetEmail
}