'use strict'

const { aesEncryptData, aesDecryptData } = require('../utils/encrypt');

const encrypt = (data, fields, secret) => {  
  for (let field of fields) {
    const fieldValue = data[field];

    if (fieldValue) {
      data[field] = aesEncryptData(fieldValue, secret);
    } else {
      data[field] = undefined;
    }
  }
};

const decrypt = (data, fields, secret) => {
  for (let field of fields) {
    const fieldValue = data[field];

    if (fieldValue) {
      data[field] = aesDecryptData(fieldValue, secret);
    } else {
      continue;
    }
  }
};

const encryptFields = (schema, options) => {
  if (!(options && options.secret)) {
    throw new Error('The secret key is missing');
  }

  const fieldsToEncrypt = options.fields || [];
  const secret = options.secret;

  schema.pre('save', function(next) {
    try {
      encrypt(this, fieldsToEncrypt, secret);
      next();
    } catch (err) {
      next(err);
    }
  });

  schema.pre('findOneAndUpdate', function(next) {
    for (let field of fieldsToEncrypt) {
      const plainTextValue = this._update.$set[field];
      const updateObj = { $set: {} };
      updateObj.$set[field] = aesEncryptData(plainTextValue, secret)
      this.update({}, updateObj);
    }
    next();
  });

  schema.post('findOne', function(doc) {
    try {
      decrypt(doc, fieldsToEncrypt, secret);
    } catch (err) {
      return;
    }
  })
}

module.exports = { encryptFields };
