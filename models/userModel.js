const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email!']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password!'],
    minlength: 8
  },
  passwordConfirm: {
    type: String, 
    required: [true, 'Please confirm your password!'],
    validate: {
      // Only works on create and save!
      validator: function(el) {
        return el  === this.password
      },
      message: 'Password are not the same!'
    }
  }
});

// Password encryption middleware
userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) {
    return next()
  }

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12)

  // Delete passwordConfirm field
  this.passwordConfirm = undefined

  next()
})

const User = mongoose.model('Users', userSchema)

module.exports = User