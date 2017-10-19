const { ObjectID } = require('mongodb')
const {mongoose} = require('../server/db/mongoose')
const {Todo} = require('../server/models/todo.model')

// Remove everything of collection
Todo.remove({})
  .then(result => console.log(result))
  .catch(e => console.log(e))

// Todo.findOneAndRemove
Todo.findOneAndRemove({_id: '59e815eb8bc03ceadddd27d9'})
  .then(todo => {
    console.log(todo)
  })
  .catch(e => console.log(e))

// Todo.findByIdAndRemove
Todo.findByIdAndRemove('59e815eb8bc03ceadddd27d9')
  .then(doc => console.log('Todo', doc))
  .catch(e => console.log(e))
