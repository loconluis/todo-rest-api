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

/* ---------------------Todos routes ---------------------- */
// Post a new todo on db
app.post('/todos', authenticate, (req, res) => {
  let todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  })
  // Save the doc on mongodb
  todo.save()
    .then(result => res.send(result))
    .catch(err => res.status(400).send(err))
})
// Get all todos on db
app.get('/todos', authenticate, (req, res) => {
  // getting todos
  Todo.find({
    _creator: req.user._id
  })
    .then((todos) => res.send({todos}))
    .catch(err => res.status(400).send(err))
})
// get an specific todo with ID
app.get('/todos/:id', authenticate, async (req, res) => {
  try {
    const id = req.params.id
    if (!ObjectID.isValid(id)) { return res.status(404).send({message: 'INVALID ID'}) }
    const todo = await Todo.findOne({
      _id: id,
      _creator: req.user._id
    })
    if (!todo) {
      return res.status(404).send({message: 'NOT RESULTS'})
    }
    res.status(200).send({todo})
  } catch (e) {
    res.status(400).send({message: 'Fail request' + e})
  }
})
// delete an specific todo with ID
app.delete('/todos/:id', authenticate, async (req, res) => {
  try {
    const id = req.params.id

    if (!ObjectID.isValid(id)) {
      return res.status(404).send({message: 'NOT VALID ID'})
    }

    const todo = await Todo.findOneAndRemove({_id: id, _creator: req.user._id})
    if (!todo) {
      return res.status(404).send({message: 'NOT RESULTS'})
    }
    res.status(200).send({todo})
  } catch (e) {
    res.status(400).send({message: 'Fail request ' + e})
  }
})
// patch route ?
app.patch('/todos/:id', authenticate, async (req, res) => {
  try {
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

    const todo = await Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true})
    if (!todo) {
      return res.status(404).send()
    }

    res.status(200).send({todo})
  } catch (e) {
    res.status(400).send({message: 'Fail request' + err})
  }
})

/* ---------------------User routes ---------------------- */
// Post a new user on db
app.post('/users', async (req, res) => {
  try {
    const body = _.pick(req.body, ['email', 'password'])
    const user = await new User(body)
    await user.save()
    const token = await user.generateAuthToken()
    res.header('x-auth', token).send(user)
  } catch (e) {
    res.status(400).send(e)
  }
})
// authorized profile
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user)
})
// POST /users/login {email, password}
app.post('/users/login', async (req, res) => {
  try {
    const body = _.pick(req.body, ['email', 'password'])
    const user = await User.findByCredentials(body.email, body.password)
    const token = await user.generateAuthToken()
    res.header('x-auth', token).send(user)
  } catch (e) {
    res.status(400).send()
  }
})
// remove the token to get logout
app.delete('/users/me/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token)
    res.status(200).send()
  } catch (e) {
    res.status(400).send()
  }
})

// Running port
app.listen(port, () => {
  console.log(`Server is running on ${port}`)
})

module.exports = {app}
