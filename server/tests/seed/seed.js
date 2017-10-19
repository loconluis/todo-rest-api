const { ObjectID } = require('mongodb')
const jwt = require('jsonwebtoken')
const { Todo } = require('../../models/todo.model')
const { User } = require('../../models/user.model')

const userOneID = new ObjectID()
const userTwoID = new ObjectID()

const users = [
  {
    _id: userOneID,
    email: 'luis.test@gmail.com',
    password: 'userOnePass',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({_id: userOneID, access: 'auth'}, 'abc123').toString()
      }
    ]
  },
  {
    _id: userTwoID,
    email: 'locon.test@gmail.com',
    password: 'userTwoPass'
  }
]

const todos = [
  {
    _id: new ObjectID(),
    text: 'First test todo'
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
  },
  {
    _id: new ObjectID(),
    text: 'Third test todo'
  },
  {
    _id: new ObjectID(),
    text: 'Fourth test todo'
  }
]

const populateTodos = (done) => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(todos)
    }).then(() => done())
}

const populateUsers = (done) => {
  User.remove({})
    .then(() => {
      let userOne = new User(users[0]).save()
      let userTwo = new User(users[1]).save()

      return Promise.all([userOne, userTwo])
    }).then(() => done())
}

module.exports = {
  todos,
  users,
  populateTodos,
  populateUsers
}
