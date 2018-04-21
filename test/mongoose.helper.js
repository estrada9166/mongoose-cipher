module.exports = function (mongooseConnection, cb) {
  const promises = []

  for (const i in mongooseConnection.collections) {
    if (mongooseConnection.collections.hasOwnProperty(i)) {
      promises.push(mongooseConnection.collections[i].remove())
    }
  }

  Promise.all(promises)
    .then(() => cb())
    .catch(err => cb(err))
}
