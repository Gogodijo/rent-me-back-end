const renterRouter = require('express').Router()
const createRenter = require('./createRenter')


renterRouter.post('/createRenter', createRenter)


module.exports = createRenter