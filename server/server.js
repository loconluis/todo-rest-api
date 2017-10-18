// Server modules
const express = require('express')
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')

// Dependencies
const { mongoose } = require('./db/mongoose') // connection instance
const { Todo } = require('./models/todo.model') // Model of ToDo
const { User } = require('./models/user.model') // Model of User
// App instance of express
const app = express()
// middleware of bodyparser
app.use(bodyParser.json())
// Post a new todo on db
app.post('/todos', (req, res) => {
  let todo = new Todo({
    text: req.body.text
  })
  // Save the doc on mongodb
  todo.save()
    .then(result => res.send(result))
    .catch(err => res.status(400).send(err))
})
// Get all todos on db
app.get('/todos', (req, res) => {
  // getting todos
  Todo.find()
    .then((todos) => res.send({todos}))
    .catch(err => res.status(400).send(err))
})
// get an specific todo with ID
app.get('/todos/:id', (req, res) => {
  const id = req.params.id

  if (!ObjectID(id)) { return res.status(404).send() }

  // if ID is valid then search
  Todo.findById(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send({message: 'NOT RESULTS'})
      }
      res.status(200).send({todo})
    })
    .catch(e => res.status(400).send({message: 'Fail request' + e}))
})
// Running port
app.listen(3000, () => {
  console.log('Server is running on port 3000')
})

module.exports = {app}
