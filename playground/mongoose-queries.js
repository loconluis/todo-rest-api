const { ObjectID } = require('mongodb')
const {mongoose} = require('../server/db/mongoose')
const {Todo} = require('../server/models/todo.model')

const id = '59e7cb5245239619623c27bc'

if (!ObjectID.isValid(id)) {
  console.log('ID NOT valid')
}

// this Find return an array
Todo.find({
  _id: id
}).then(todos => {
  console.log('Todos', todos)
})
// use findeOne to search just one doc with whatever propierty
Todo.findOne({
  _id: id
}).then(todo => {
  console.log('Todo:', todo)
})
// Just this when you search is by ID
Todo.findById(id)
  .then(todo => {
    if (!todo) {
      return console.log('Id not found')
    }
    // success finding the id
    console.log('Todo by Id', todo)
  })
  .catch(e => console.log(e))
