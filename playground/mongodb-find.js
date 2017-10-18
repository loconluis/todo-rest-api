// const MongoClient = require('mongodb').MongoClient
const { MongoClient, ObjectID } = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) { return console.log('Unable to connect to MongoDB server') }

  console.log('Connected to MongoDB server')

  find to search return a cursor, to parse use toArray
  db.collection('Todo').find({
    _id: new ObjectID('59e6328fbf7c7d1bcd7020e9') // The way to query for ID using ObjectID
  }).toArray()
    .then((docs) => {
      console.log('Todos:')
      console.log(JSON.stringify(docs, undefined, 2))
    })
    .catch(err => console.log('Unable to fetch todos', err))

  db.collection('Todo').find().count() // use .count() to lenght of docs
    .then((count) => {
      console.log(`Todos count: ${count}`)
    })
    .catch(err => console.log('Unable to count todos', err))

  // The challenge
  db.collection('Users').find({
    name: "Luis Locon" // The way to query for ID using ObjectID
  }).toArray()
    .then((docs) => {
      console.log('Todos:')
      console.log(JSON.stringify(docs, undefined, 2))
    })
    .catch(err => console.log('Unable to fetch todos', err))

  // db.close() //close the database connection
})