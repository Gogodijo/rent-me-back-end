const logger = require('./logger')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

const verifyToken = async (req, res, next) => {
  const bearerHeader = req.headers['authorization']

  if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ')
      const bearerToken = bearer[1]
      const decoded = await jwt.verify(bearerToken, process.env.SECRET)
      req.user = decoded
      next()
  } else {
      res.sendStatus(401)
  }
}



module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  verifyToken
}