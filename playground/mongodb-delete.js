// const MongoClient = require('mongodb').MongoClient
const { MongoClient, ObjectID } = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) { return console.log('Unable to connect to MongoDB server') }

  console.log('Connected to MongoDB server')

  // deleteMany
  db.collection('Todo').deleteMany({text: 'Facebook HackDay'}) // delete many docs with the query
    .then(result => { console.log(result) })
    .catch(err => console.log('Unable to delete many docs', err))

  // deleteOne
  db.collection('Todo').deleteOne({text: 'Facebook HackDay'}) // delete one(first) doc with the query
    .then(result => {console.log(result)})
    .catch(err => console.log('Unable to delete the doc', err))

  // findOneAndDelete
  db.collection('Todo').findOneAndDelete({completed: false}) // return the value of the doc, and deleted
    .then(docs => console.log(docs))
    .catch(err => console.log('Unable to find the doc', err))

  // The challenge
  db.collection('Users').deleteMany({name: 'Luis Locon'})
    .then(result => console.log(result))
    .catch(err => console.log(err))

  db.collection('Users').deleteOne({_id: new ObjectID('59e6cac8976c3bb6b5f48e08')})
    .then(result => console.log(result))
    .catch(err => console.log(err))

  // db.close() //close the database connection
})