const mongoose = require('./dbcon')
let Schema = mongoose.Schema

let UserSchema = new Schema({
  email: {
    type: String,
    require: true,
    trim: true,
    minlength: 1
  }
})

module.exports.User = mongoose.model('User', UserSchema)
