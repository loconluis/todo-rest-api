require('./config/config')

// Server modules
const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')

// Dependencies
const { mongoose } = require('./db/mongoose') // connection instance
const { Todo } = require('./models/todo.model') // Model of ToDo
const { User } = require('./models/user.model') // Model of User
const { authenticate } = require('./middleware/authenticate')
// App instance of express
const app = express()
// PORT variable
const port = process.env.PORT
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
  if (!ObjectID.isValid(id)) { return res.status(404).send({message: 'INVALID ID'}) }

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
// delete an specific todo with ID
app.delete('/todos/:id', (req, res) => {
  const id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({message: 'NOT VALID ID'})
  }

  Todo.findByIdAndRemove(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send({message: 'NOT RESULTS'})
      }

      res.status(200).send({todo})
    })
    .catch(e => res.status(400).send({message: 'Fail request ' + e}))
})
// patch route ?
app.patch('/todos/:id', (req, res) => {
  const id = req.params.id
  const body = _.pick(req.body, ['text', 'completed'])

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({message: 'NOT VALID ID'})
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime()
  } else {
    body.completed = false
    body.completedAt = null
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
    .then(todo => {
      if (!todo) {
        return res.status(404).send()
      }

      res.status(200).send({todo})
    })
    .catch(err => res.status(400).send({message: 'Fail request' + err}))
})

// ---------------------User routes ----------------------
// Post a new user on db
app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password'])
  let user = new User(body)

  // Save the doc on mongodb
  user.save()
    .then(() => {
      return user.generateAuthToken() // method in user model to generate a token
    })
    .then(token => {
      res.header('x-auth', token).send(user) // personal header to set the auth
    })
    .catch(err => res.status(400).send(err))
})

// authorized profile
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user)
})

// Running port
app.listen(port, () => {
  console.log(`Server is running on ${port}`)
})

module.exports = {app}
