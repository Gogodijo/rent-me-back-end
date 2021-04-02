const express = require('express')
require('dotenv').config()
const app = express()
const bodyparser = require('body-parser')
app.use(bodyparser.json())
app.listen(3000, (err)=> {
    if(err){
        console.log(err)
    }
    else{
        console.log("Server running ")
    }
})

const mongo = require('./database')
mongo.con

const loginAndRegister = require('./Controllers/logInAndRegister')
const posts = require('./Controllers/posts')

app.post("/refresh", loginAndRegister.refresh)
app.post("/login", loginAndRegister.logIn)
app.post("/register", loginAndRegister.register)
app.get("/confirmation/:token", loginAndRegister.verifyUser)
app.post("/resetpassword/:token", loginAndRegister.resetPassword)
app.post("/resetpasswordlink", loginAndRegister.sendResetEmail)
app.post("/post",loginAndRegister.verifyToken,posts.createPost)
app.get("/post", posts.getAllPosts)
