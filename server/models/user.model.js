const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

let Schema = mongoose.Schema

let UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      isAsync: false,
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
})

// @override method of mongoose
UserSchema.methods.toJSON = function () {
  // this scope take a Schema
  let userObject = this.toObject()

  return _.pick(userObject, ['_id', 'email'])
}
// generate a jwt token for a user
UserSchema.methods.generateAuthToken = function () {
  // this scope take a Schema
  let access = 'auth'
  let token = jwt.sign({_id: this._id.toHexString(), access}, 'abc123').toString()

  this.tokens.push({access, token})

  return this.save().then(() => { return token })
}
// find a user by token
UserSchema.statics.findByToken = function (token) {
  let decoded

  try {
    decoded = jwt.verify(token, 'abc123')
  } catch (e) {
    return Promise.reject()
  }

  return this.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}

let User = mongoose.model('User', UserSchema)

module.exports = { User }
