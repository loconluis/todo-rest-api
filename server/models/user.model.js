const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

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
// find by credentials
UserSchema.statics.findByCredentials = function (email, password) {
  return this.findOne({email})
          .then(user => {
            if (!user) {
              return Promise.reject()
            }

            return new Promise((resolve, reject) => {
              bcrypt.compare(password, user.password, (err, res) => {
                if (err) {
                  reject(err)
                }
                resolve(user)
              })
            })
          })
}
// hashing passwords using mongoose middleware
UserSchema.pre('save', function (next) {  // trigger a middleware when event save is on
  if (this.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(this.password, salt, (err, hash) => {
        if (err) { console.log(err) }
        this.password = hash
        next()
      })
    })
  } else {
    next()
  }
})

let User = mongoose.model('User', UserSchema)

module.exports = { User }
