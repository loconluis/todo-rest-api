// Server modules
const express = require('express')
const bodyParser = require('body-parser')

// Dependencies
const { mongoose } = require('./db/mongoose') // connection instance
const { Todo } = require('./models/todo.model') // Model of ToDo
const { User } = require('./models/user.model') // Model of User
// App instance of express
const app = express()
// middleware of bodyparser
app.use(bodyParser.json())

app.post('/todos', (req, res) => {
  let todo = new Todo({
    text: req.body.text
  })

  todo.save()
    .then(result => res.send(result))
    .catch(err => res.status(400).send(err))

  // console.log(req.body)
})

// Running port
app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
