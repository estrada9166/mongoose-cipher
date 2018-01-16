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

module.exports = { aesEncryptData, aesDecryptData }
