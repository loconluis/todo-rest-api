const { SHA256 } = require('crypto-js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

let password = '123abc'
// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     if (err) { console.log(err) }
//     console.log(hash)
//   })
// })

let hashPassword = '$2a$10$NcF7i066W7GbqAZn1t2vSOnFscqCHKpvYEOKv4csAtjMGFx8q6iZ2'

bcrypt.compare(password, hashPassword, (err, res) => {
  if (err) { console.log(err) }
  console.log(res)
})

// let data = {
//   id: 10
// }

// let token = jwt.sign(data, '123abc')
// console.log(token)
// let decoded = jwt.verify(token, '123abc')
// console.log('decoded', decoded)

// let message = 'I am user number 3'

// let hash = SHA256(message).toString()

// console.log(`Message: ${message}`)
// console.log(`HASH: ${hash}`)

// let data = {
//   id: 4
// }
// let token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// // token.data.id = 5
// // token.hash = SHA256(JSON.stringify(token.data)).toString()

// let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString()
// if (resultHash === token.hash) {
//   console.log('Data was not changed!')
// } else {
//   console.log('Data was changed. Don\'t trust!')
// }
