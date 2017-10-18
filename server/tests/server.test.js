const expect = require('expect')
const request = require('supertest')
const { ObjectID } = require('mongodb')

const { app } = require('../server')
const { Todo } = require('../models/todo.model')

const todos = [
  {
    _id: new ObjectID(),
    text: 'First test todo'
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo'
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

// Before a test, drop the database
beforeEach(done => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(todos)
    }).then(() => done())
})

// POST /todos test
describe('POST /todos', () => {
  // Test if todo was create it on DB
  it('Should create a new ToDo', (done) => {
    let text = 'Test todo text'

    request(app)
      .post('/todos')
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
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(4)
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
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(4)
      })
      .end(done)
  })
})

describe('GET /todo/:id', () => {
  it('Should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
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
      .expect(404)
      .expect(res => {
        expect(res.body.message).toBe('NOT RESULTS')
      })
      .end(done)
  })

  it('Should return 404 for non obj ids', (done) => {
    request(app)
      .get('/todos/123abc')
      .expect(404)
      .end(done)
  })
})
