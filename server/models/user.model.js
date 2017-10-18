const mongoose = require('./dbcon')
let Schema = mongoose.Schema

let userSchema = new Schema({
  email: {
    type: String,
    require: true,
    trim: true,
    minlength: 1
  }
})

module.exports = mongoose.model('User', userSchema)
