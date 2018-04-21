const mongoose = require('mongoose')
const mongooseClearDB = require('../test/mongoose.helper')

before(done => {
  const tempDBConnectionString = 'mongodb://localhost:27017/mongoose-cipher'

  mongoose.connect(tempDBConnectionString, () => {
    mongooseClearDB(mongoose.connection, done)
  })
})

after(async () => {
  await mongoose.connection.db.dropDatabase()
  await mongoose.connection.close()
})
