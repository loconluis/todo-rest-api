const mongoose = require('mongoose')
// to support promises
mongoose.Promise = global.Promise
// connection string
mongoose.connect('mongodb://localhost:27017/TodoApp', {useMongoClient: true})

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

module.exports = mongoose.model('Todo', todoSchema)
