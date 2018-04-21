'use strict'

const CryptoJS = require('crypto-js')

const aesEncryptData = (payload, secret) => {
  return CryptoJS.AES.encrypt(JSON.stringify(payload), secret).toString()
}

const aesDecryptData = (ciphertext, secret) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext.toString(), secret)
  const plainText = bytes.toString(CryptoJS.enc.Utf8)

  return JSON.parse(plainText)
}

const encrypt = (data, fields, secret) => {
  for (let field of fields) {
    const fieldValue = data[field]

    if (fieldValue) {
      data[field] = aesEncryptData(fieldValue, secret)
    } else {
      data[field] = undefined
    }
  }
}

const decrypt = (data, fields, secret) => {
  for (let field of fields) {
    const fieldValue = data[field]

    if (fieldValue) {
      data[field] = aesDecryptData(fieldValue, secret)
    } else {
      continue
    }
  }
}

module.exports = { aesEncryptData, aesDecryptData, encrypt, decrypt }
