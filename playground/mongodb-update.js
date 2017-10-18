// const MongoClient = require('mongodb').MongoClient
const { MongoClient, ObjectID } = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) { return console.log('Unable to connect to MongoDB server') }

  console.log('Connected to MongoDB server')

  // db.collection('Todo').findOneAndUpdate({
  //   _id: new ObjectID('59e6d4d4976c3bb6b5f48ee0')
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then( result => console.log(result))
  // .catch(err => console.log(err))

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('59e6cadc976c3bb6b5f48e10')
  }, {
    $set: {
      name: 'Luis Locon'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then(result => console.log(result))
  .catch(err => console.log(err))

  // db.close() //close the database connection
})