const mongoose = require('mongoose')
// to support promises
mongoose.Promise = global.Promise
// connection string
mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true})

module.exports = {mongoose}
