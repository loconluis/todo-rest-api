
const mongoose = require('mongoose')
// to support promises
mongoose.Promise = global.Promise
// connection string
mongoose.connect('mongodb://localhost:27017/TodoApp', {useMongoClient: true})

// Model
let Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
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
})

let newTodo = new Todo({
})

// saving a todo
newTodo.save()
  .then(doc => console.log(`Saved todo ${doc}`))
  .catch(e => console.log(`Unable to save Todo ${e}`))

// // the challenge
// let _newTodo = new Todo({
//   text: 'Cook Dinner',
//   completed: true,
//   completedAt: 2
// })

// _newTodo.save()
//   .then(doc => console.log(`Saved todo ${doc}`))
//   .catch(e => console.log(`Unable to save Todo ${e}`))

// let User = mongoose.model('User', {
//   email: {
//     type: String,
//     require: true,
//     trim: true,
//     minlength: 1
//   }
// })
