/* eslint-env mocha */
const expect = require('expect')
const request = require('supertest')
const { ObjectID } = require('mongodb')

const { app } = require('../server')
const { Todo } = require('../models/todo.model')
const { User } = require('../models/user.model')

const { todos,
        users,
        populateTodos,
        populateUsers } = require('./seed/seed')

// Before a test, drop the database
beforeEach(populateUsers)
beforeEach(populateTodos)

// POST /todos test
describe('POST /todos', () => {
  // Test if todo was create it on DB
  it('Should create a new ToDo', (done) => {
    let text = 'Test todo text'

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Todo.find({text})
          .then((todos) => {
            expect(todos.length).toBe(1)
            expect(todos[0].text).toBe(text)
            done()
          })
          .catch(err => done(err))
      })
  })
  // Test verify valid data send it by post to save on Mongo
  it('Should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(2)
            done()
          }).catch(e => done(e))
      })
  })
})

// GET /todos
describe('GET /todos', () => {
  it('Should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1)
      })
      .end(done)
  })
})

// GET /todos/:id
describe('GET /todo/:id', () => {
  it('Should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done)
  })

  it('Should return 404 if todo not found', (done) => {
    const _pid = new ObjectID().toHexString()
    request(app)
      .get(`/todos/${_pid}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .expect(res => {
        expect(res.body.message).toBe('NOT RESULTS')
      })
      .end(done)
  })

  it('Should return 404 for non obj ids', (done) => {
    request(app)
      .get('/todos/123abc')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)
  })

  it('Should not return todo doc created by other user', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done)
  })
})

// DEL /todos/:id
describe('DELET /todos/:id', () => {
  it('Should remove a todo', (done) => {
    let hexID = todos[1]._id.toHexString()
    request(app)
      .delete(`/todos/${hexID}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(hexID)
      })
      .end((err, res) => {
        if (err) { return done(err) }
        // query to truly delete the todo
        Todo.findById(hexID)
          .then(todo => {
            expect(todo).toNotExist()
            done()
          })
          .catch(e => done(e))
      })
  })

  it('Should not remove a todo from other creator', (done) => {
    request(app)
      .delete(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) { return done(err) }
        // query to truly delete the todo
        Todo.findById(todos[0]._id.toHexString())
          .then(todo => {
            expect(todo).toExist()
            done()
          })
          .catch(e => done(e))
      })
  })

  it('Should return a 404 if todo not found', (done) => {
    const _pid = new ObjectID().toHexString()
    request(app)
      .delete(`/todos/${_pid}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .expect(res => {
        expect(res.body.message).toBe('NOT RESULTS')
      })
      .end(done)
  })

  it('Should return 404 if obj id is invalid', (done) => {
    request(app)
      .delete('/todos/123abc')
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .expect(res => {
        expect(res.body.message).toBe('NOT VALID ID')
      })
      .end(done)
  })
})

// PATCH /todos/:id
describe('PATCH /todos/:id', () => {
  it('Should update the todo', (done) => {
    let hexID = todos[0]._id.toHexString()
    let text = 'Update by test'
    request(app)
      .patch(`/todos/${hexID}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({text, completed: true})
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toNotEqual(todos[0].text)
        expect(res.body.todo.completed).toBe(true)
        expect(res.body.todo.completedAt).toBeA('number')
      })
      .end(done)
  })

  it('Should not update the todo from other creator', (done) => {
    let hexID = todos[0]._id.toHexString()
    let text = 'Update by test'
    request(app)
      .patch(`/todos/${hexID}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({text, completed: true})
      .expect(404)
      .end(done)
  })

  it('Should clear completedAt when todo is not completed', (done) => {
    let text = 'Update by test but changing completed to false'
    let hexID = todos[1]._id.toHexString()
    request(app)
    .patch(`/todos/${hexID}`)
    .set('x-auth', users[1].tokens[0].token)
    .send({text, completed: false})
    .expect(200)
    .expect(res => {
      expect(res.body.todo.text).toBe(text)
      expect(res.body.todo.completed).toBe(false)
      expect(res.body.completedAt).toNotExist()
    })
    .end(done)
  })
})

// Auth for users
describe('GET /users/me', () => {
  it('Shold return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString())
        expect(res.body.email).toBe(users[0].email)
      })
      .end(done)
  })

  it('Should return 401 if not authenticated', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({})
    })
    .end(done)
  })
})

// Test for creating users
describe('POST /users', () => {
  it('Should create a user', (done) => {
    let email = 'example@example.com'
    let password = 'examplePass'
    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toExist()
        expect(res.body._id).toExist()
        expect(res.body.email).toBe(email)
      })
      .end(err => {
        if (err) {
          return done(err)
        }

        User.findOne({email})
          .then((user) => {
            expect(user).toExist()
            expect(user.password).toNotBe(password)
            done()
          })
          .catch(e => done(e))
      })
  })

  it('Should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({email: 'luis', password: '123'})
      .expect(400)
      .end(done)
  })

  it('Should not create user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: users[0].password
      })
      .expect(400)
      .end(done)
  })
})

// Test for login route
describe('POST /users/login', () => {
  it('Should login user an return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toExist()
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        User.findById({_id: users[1]._id})
          .then(user => {
            expect(user.tokens[1]).toInclude({
              access: 'auth',
              token: res.header['x-auth']
            })
            done()
          })
          .catch(e => done(e))
      })
  })

  it('Should reject invalid login', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: users[1].password + 'acb'
    })
    .expect(400)
    .expect(res => {
      expect(res.headers['x-auth']).toNotExist()
    })
    .end((err, res) => {
      if (err) {
        return done(err)
      }

      User.findById({_id: users[1]._id})
        .then(user => {
          expect(user.tokens.length).toBe(1)
          done()
        })
        .catch(e => done(e))
    })
  })
})

// Test for delete token when logout
describe('DELETE /users/me/token', () => {
  it('Should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        User.findById(users[0]._id)
          .then(user => {
            expect(user.tokens.length).toBe(0)
            done()
          })
          .catch(e => done(e))
      })
  })
})
