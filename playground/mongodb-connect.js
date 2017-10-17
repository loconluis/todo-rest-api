const MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) { return console.log('Unable to connect to MongoDB server') }

  console.log('Connected to MongoDB server')

  // db.collection create a new collection of data
  db.collection('Todo').insertOne({ // insert one document (ToDo)
    text: 'Something To Do',
    completed: false
  }, (err, result) => {
    if (err) { return console.log('Unbale to insert ToDo') }

    console.log(JSON.stringify(result.ops, undefined, 2)) // result.ops content the document 
  })

  // db.collection create a new collection of data
  db.collection('Users').insertOne({ // insert one document (User)
    name: 'Luis Locon',
    age: 25,
    location: 'Guatemala'
  }, (err, res) => {
    if (err) { return console.log('Unable to insert User') }

    console.log(JSON.stringify(res.ops, undefined, 2)) // result.ops content the document 
  })

  db.close() //close the database connection
})