const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
    } else {
        request.token = null
    }
    next()
}

const userExtractor = async (request, response, next) => {
    if (!request.token) {
      request.user = null
    } else {
      try {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        if (!decodedToken.id) {
          request.user = null
        } else {
          request.user = await User.findById(decodedToken.id)
        }
      } catch (error) {
        if (error.name === 'JsonWebTokenError') {
          request.user = null
        } else {
          return response.status(400).json({ error: error.message })
        }
      }
    }
    next()
  }

module.exports = {
    tokenExtractor,
    userExtractor
}