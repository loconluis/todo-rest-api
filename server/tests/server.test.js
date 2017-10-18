const expect = require('expect')
const request = require('supertest')

const { app } = require('../server')
const { Todo } = require('../models/todo.model')
// Before a test, drop the database
beforeEach(done => {
  Todo.remove({})
    .then(() => done())
})

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

        Todo.find()
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
            expect(todos.length).toBe(0)
            done()
          }).catch(e => done(e))
      })
  })
})
