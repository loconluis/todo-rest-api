const mongoose = require('mongoose')
// to support promises
mongoose.Promise = global.Promise
// connection string
mongoose.connect('mongodb://localhost:27017/TodoApp', {useMongoClient: true})

module.exports = {mongoose}
