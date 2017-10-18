const mongoose = require('./dbcon')
let Schema = mongoose.Schema

let todoSchema = new Schema(
  {
    text: {
      type: String,
      require: true,
      minlength: 1,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Number,
      default: null
    }
  }
)

module.exports.Todo = mongoose.model('Todo', todoSchema)
