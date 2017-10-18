
// const User = require('./models/user.model')
const Todo = require('./models/todo.model')

let newTodo = new Todo({
  text: 'Cook Dinner',
  completed: true,
  completedAt: 2
})

newTodo.save()
  .then(doc => console.log(`Saved todo ${doc}`))
  .catch(e => console.log(`Unable to save Todo ${e}`))
