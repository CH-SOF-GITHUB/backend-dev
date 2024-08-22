const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

/* This code snippet is defining a Mongoose schema for a user in a Node.js application. Let's break
down what each part of the schema represents: */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'admin'
    },
    isActive: {
      type: Boolean,
      default: false,
      required: false
    },
    avatar: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
)


/* This code snippet is a Mongoose middleware function that runs before saving a user document to the
database. Specifically, it is a pre-save hook that intercepts the save operation and performs some
actions before saving the user data. */
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next()
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    next()
})

module.exports = mongoose.model('User', userSchema)