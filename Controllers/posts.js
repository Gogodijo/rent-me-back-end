const jwt = require('jsonwebtoken')

exports.createPost = async (req,res) => {
    res.json({
        message:"Post created"
    })
}

exports.getAllPosts = async (req,res) => {
    res.json({
        message:"All posts:"
    })
}