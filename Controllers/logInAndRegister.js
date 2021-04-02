const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const User = require('../Models/user')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

exports.logIn = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email: email })
    if (!user) {
        res.json({
            status: false,
        })
    }
    else if (!user.isVerified) {
        res.json({
            status: false,
            message: "Please verify your email adress"
        })
    } else {
        bcrypt.compare(password, user.password, (err, same) => {
            if (err) {
                res.json({
                    status: false
                })
            }
            if (!same) {
                res.json({
                    status: false,
                    message: "Wrong password"
                })
            }
            else {
                jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "30s" }, (err, token) => {
                    if (err) {

                    }
                    else {
                        res.json({
                            status: true,
                            acess_token: token,
                            refresh_token: user.refresh_token
                        })
                    }
                })
            }
        })
    }
}

exports.register = async (req, res) => {
    const { email, name, password } = req.body
    if (await User.findOne({ email: email })) {
        res.json({
            status: false,
            message: "Email already in use"
        })
    }
    else {
        try {
            const hashedPasword = await bcrypt.hash(password, 10)
            const refreshToken = jwt.sign({ email: email }, process.env.REFRESH_TOKEN_SECRT)
            const user = new User({
                email: email,
                name: name,
                password: hashedPasword
            })
            savedUser = await user.save()
            console.log(savedUser)
            if (savedUser) {
                jwt.sign({ user_email: user.email },
                    process.env.EMAIL_SECRET,
                    { expiresIn: "7d" }, (err, token) => {
                        if (!err) {
                            console.log(token)
                            const url = "http://localhost:3000/confirmation/" + token
                            console.log(url)
                            transporter.sendMail({
                                to: user.email,
                                subject: "Confirm your email adress",
                                html: "Please click this link to confirm your email <a href=\"" + url + "\">Link</a>"
                            }, (error, info) => {
                                if (error) {
                                    console.log(error)
                                }
                                else {
                                    console.log(info)
                                }
                            })
                        }
                        else {
                            console.log(err)
                        }
                    })
                res.json({
                    status: true,
                    "Message": "Registeration complete"
                })
            }
            else {
                res.json({
                    status: false,
                    message: "Something went wrong with resigisteration"
                })
            }
        }
        catch (err) {
            console.log(err)
        }
    }
}

exports.verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization']

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.sendStatus(403)
            }
            else {
                next()
            }
        })
    } else {
        res.sendStatus(403)
    }
}

exports.verifyUser = async (req, res) => {
    try {
        const jwtToken = jwt.verify(req.params.token, process.env.EMAIL_SECRET)
        const email = jwtToken.user_email
        const user = await User.findOneAndUpdate({ email: email }, { isVerified: true })
        res.json({
            status: true,
            message: "You have verified your email adress. You can now log in"
        })
    }
    catch {
        res.json({
            status: false,
            message: "failed"
        })
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const email = jwt.verify(req.params.token, process.env.PASSWORD_RESET_SECRET)
        const hashedPasword = await bcrypt.hash(req.body.password, 10)
        const refreshToken = jwt.sign({ email: email }, process.env.REFRESH_TOKEN_SECRT)
        const user = await User.findOneAndUpdate({ email: email }, { password: hashedPasword, refresh_token: refreshToken })
        if (user) {
            res.json({
                status: true,
                message: "Password reseted"
            })
        }
    }
    catch {
        res.json({
            status: false,
            message: "Failed =("
        })
    }
}

exports.sendResetEmail = async (req, res) => {
    const email = req.body.email
    const user = await User.findOne({ email: email })
    if (user) {
        jwt.sign(email, process.env.PASSWORD_RESET_SECRET, (err, token) => {
            url = "http://localhost:3000/resetpassword" + token
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
        res.json({
            status: true,
            message: "Reset link sent"
        })
    }
    else {
        res.json({
            status: false,
            message: "Invalid email"
        })
    }
}

exports.refresh = async (req, res) => {
    let refresh_token = req.body.token
    const bearerHeader = req.headers['authorization']
    refresh_token = ""
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        jwt.verify(bearerToken, process.env.JWT_SECRET, async (err, decoded) => {
            if (err.name == "TokenExpiredError") {
                const decoded = jwt.decode(bearerToken)
                const user = await User.findOne({ email: decoded.email })
                if (user.refresh_token == refresh_token) {
                    jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "30s" }, (err, token) => {
                        res.json({
                            status: true,
                            token: token
                        })
                    })
                }
                else {

                }
            }
        })
    } else {
        res.sendStatus(403)
    }

}