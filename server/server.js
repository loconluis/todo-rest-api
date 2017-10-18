
const mongoose = require('mongoose')
// to support promises
mongoose.Promise = global.Promise
// connection string
mongoose.connect('mongodb://localhost:27017/TodoApp', {useMongoClient: true})

// Model
let Todo = mongoose.model('Todo', {
  text: {
    type: String
  },
  completed: {
    type: Boolean
  },
  completedAt: {
    type: Number
  }
})

let newTodo = new Todo({
  text: 'Cook Dinner'
})

// saving a todo
newTodo.save()
  .then(doc => console.log(`Saved todo ${doc}`))
  .catch(e => console.log(`Unable to save Todo ${e}`))

// the challenge
let _newTodo = new Todo({
  text: 'Cook Dinner',
  completed: true,
  completedAt: 2
})

_newTodo.save()
  .then(doc => console.log(`Saved todo ${doc}`))
  .catch(e => console.log(`Unable to save Todo ${e}`))
