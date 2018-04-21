const mongoose = require('mongoose')
const { expect } = require('chai')
const Schema = mongoose.Schema

const { encryptFields } = require('../lib')

const secret = 'YOUR_SECRET_KEY'

// Create a schema and encrypt all the fields
const userSchema = new Schema({
  name: String,
  email: String,
  username: String
})

userSchema.plugin(encryptFields, { fields: ['name', 'email', 'username'], secret })

const User = mongoose.model('User', userSchema)

// Create a new schema and encrypt only one field
const friendSchema = new Schema({
  friendName: String,
  username: String
})

friendSchema.plugin(encryptFields, { fields: ['friendName'], secret })

const Friend = mongoose.model('Friend', friendSchema)

describe('Mongoose-cipher', () => {
  describe('User schema, encrypt all fields', () => {
    let user
    let encryptedUser
    let updatedUser
    const newName = 'New Name'
    const newEmail = 'email@email.com'
    before(async () => {
      user = {
        name: 'Demo',
        email: 'demo@demo.com',
        username: 'demo'
      }
    })

    it('Saved info should be encrypted and different from user info', async () => {
      try {
        const userInfo = new User({
          name: user.name,
          email: user.email,
          username: user.username
        })
        encryptedUser = await userInfo.save()

        expect(encryptedUser.name).to.be.not.eq(user.name)
        expect(encryptedUser.email).to.be.not.eq(user.email)
        expect(encryptedUser.username).to.be.not.eq(user.username)
      } catch (err) {
        throw err
      }
    })

    it('Find user should be equal to user decrypted', async () => {
      try {
        const savedUser = (await User.find({ _id: encryptedUser._id }))[0]

        expect(savedUser.name).to.be.eq(user.name)
        expect(savedUser.email).to.be.eq(user.email)
        expect(savedUser.username).to.be.eq(user.username)
        expect(savedUser._id.toString()).to.be.eq(encryptedUser._id.toString())
      } catch (err) {
        throw err
      }
    })

    it('FindOne user should be equal to user decrypted', async () => {
      try {
        const savedUser = await User.findOne({ _id: encryptedUser._id })

        expect(savedUser.name).to.be.eq(user.name)
        expect(savedUser.email).to.be.eq(user.email)
        expect(savedUser.username).to.be.eq(user.username)
        expect(savedUser._id.toString()).to.be.eq(encryptedUser._id.toString())
      } catch (err) {
        throw err
      }
    })

    it('FindOneAndUpdate should return ecrypted info', async () => {
      try {
        const query = { $set: { name: newName, email: newEmail } }
        updatedUser = await User.findOneAndUpdate({ _id: encryptedUser._id }, query, { new: true })

        expect(updatedUser._id.toString()).to.be.eq(encryptedUser._id.toString())
      } catch (err) {
        throw err
      }
    })

    it('FindOne user should be equal to user updated and decrypted', async () => {
      try {
        const savedUser = await User.findOne({ _id: encryptedUser._id })

        expect(savedUser.name).to.be.eq(newName)
        expect(savedUser.email).to.be.eq(newEmail)
        expect(savedUser.username).to.be.eq(user.username)
        expect(savedUser._id.toString()).to.be.eq(encryptedUser._id.toString())
      } catch (err) {
        throw err
      }
    })
  })

  describe('Friend schema, encrypt only name', () => {
    let friend
    let encryptedFriend
    let updatedFriend
    const newFriendName = 'New Name'
    before(async () => {
      friend = {
        friendName: 'Demo Friend',
        username: 'friend'
      }
    })

    it('Saved info should encrypt only the name', async () => {
      try {
        const friendInfo = new Friend({
          friendName: friend.friendName,
          username: friend.username
        })
        encryptedFriend = await friendInfo.save()

        expect(encryptedFriend.friendName).to.be.not.eq(friend.friendName)
        expect(encryptedFriend.username).to.be.eq(friend.username)
      } catch (err) {
        throw err
      }
    })

    it('Find should be equal to friend decrypted', async () => {
      try {
        const savedFriend = (await Friend.find({ _id: encryptedFriend._id }))[0]

        expect(savedFriend.friendName).to.be.eq(friend.friendName)
        expect(savedFriend.username).to.be.eq(friend.username)
        expect(savedFriend._id.toString()).to.be.eq(encryptedFriend._id.toString())
      } catch (err) {
        throw err
      }
    })

    it('FindOne user should be equal to friend decrypted', async () => {
      try {
        const savedFriend = await Friend.findOne({ _id: encryptedFriend._id })

        expect(savedFriend.friendName).to.be.eq(friend.friendName)
        expect(savedFriend.username).to.be.eq(friend.username)
        expect(savedFriend._id.toString()).to.be.eq(encryptedFriend._id.toString())
      } catch (err) {
        throw err
      }
    })

    it('FindOneAndUpdate should return info with ecrypted name', async () => {
      try {
        const query = { $set: { friendName: newFriendName } }
        updatedFriend = await Friend.findOneAndUpdate({ _id: encryptedFriend._id }, query, { new: true })

        expect(updatedFriend._id.toString()).to.be.eq(encryptedFriend._id.toString())
      } catch (err) {
        throw err
      }
    })

    it('FindOne user should be equal to friend updated and decrypted', async () => {
      try {
        const savedFriend = await Friend.findOne({ _id: encryptedFriend._id })

        expect(savedFriend.friendName).to.be.eq(newFriendName)
        expect(savedFriend.username).to.be.eq(friend.username)
        expect(savedFriend._id.toString()).to.be.eq(encryptedFriend._id.toString())
      } catch (err) {
        throw err
      }
    })
  })
})
