const { User } = require('../models/user.model')

let authenticate = async (req, res, next) => {
  try {
    const token = req.header('x-auth')
    const user = await User.findByToken(token)
    if (!user) {
      throw new Error()
    }
    req.user = user
    req.token = token
    next()
  } catch (e) {
    res.status(401).send()
  }
}

module.exports = {
  authenticate
}
