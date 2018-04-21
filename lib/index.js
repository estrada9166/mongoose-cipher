'use strict'

const { aesEncryptData, encrypt, decrypt } = require('../utils/encrypt')

const encryptFields = (schema, options) => {
  if (!(options && options.secret)) {
    throw new Error('The secret key is missing')
  }

  const fieldsToEncrypt = options.fields || []
  const secret = options.secret

  schema.pre('save', function (next) {
    try {
      encrypt(this, fieldsToEncrypt, secret)
      next()
    } catch (err) {
      next(err)
    }
  })

  schema.pre('findOneAndUpdate', function (next) {
    for (let field of fieldsToEncrypt) {
      const plainTextValue = this._update.$set[field]
      if (plainTextValue) {
        const updateObj = { $set: {} }
        updateObj.$set[field] = aesEncryptData(plainTextValue, secret)
        this.update({}, updateObj)
      }
    }
    next()
  })

  schema.post('find', function (docs) {
    try {
      for (let doc of docs) {
        decrypt(doc, fieldsToEncrypt, secret)
      }
    } catch (err) {
      throw err
    }
  })

  schema.post('findOne', function (doc) {
    try {
      decrypt(doc, fieldsToEncrypt, secret)
    } catch (err) {
      throw err
    }
  })
}

module.exports = {encryptFields}
