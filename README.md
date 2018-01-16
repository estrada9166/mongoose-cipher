# Mongoose Cipher

## Main Idea
The idea with Mongoose cipher is to encrypt the fields that you select before save them on the database.



## Installation
```bash
$ npm install mongoose-cipher
```
## Usage

### Basic
At the moment it only works with: 
+ `save`: it will encrypt the selected fields automatically
+ `findOneAndUpdate`: it will encrypt the selected fields automatically
+ `findOne`: it will decrypt the selected fields automatically

The data is encrypted using AES thanks to [crypto-js](https://github.com/brix/crypto-js).

#### Required options:
+ `fields`: An array list of the fields of the Schema to get encrypted.
+ `secret`: The secret used to encrypt the data.

### Example:

```JavaScript
const mongoose = require('mongoose');
const { encryptFields } = require('mongoose-cipher');
const Schema = mongoose.Schema;

const User = new Schema({
  name: String,
  email: String,
  username: String
})

User.plugin(encryptFields, { fields: ['name', 'email', 'username'], secret: 'YOUR_SECRET_KEY'})
```
### Database data:
```
{
  _id: "5a5d480cc132a42b921fb010",
  name: "U2FsdGVkX19jWdf7xfM2xtZ7a5KdmM+q8WdLwP4c2hQ=",
  email: "U2FsdGVkX19GSMtPsgzybjkLl5OWG54gtdyyHYPKs2xBsNmCSnGX0hyuBjGpYGji",
  username: "U2FsdGVkX1/SU1MV/s/+w7tD5yiaKWrAhHN42N+J078=",
  __v: 0
}
```
## License

### The MIT License

Copyright (c) 2018 Alejandro Estrada

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

