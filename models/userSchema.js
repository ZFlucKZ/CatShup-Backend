const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, 'Please add a name'],
    },
    email: {
      type: String,
      require: [true, 'Please add an email'],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        ,
        'Please enter a valid email',
      ],
    },
    password: {
      type: String,
      require: [true, 'Please add a password'],
      minLength: [6, 'Password must be up to 6 character'],
      maxLength: [20, 'Password must not be more than 20 character'],
    },
    photo: {
      type: String,
      require: [true, 'Please add a photo'],
      default:
        'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1631&q=80',
    },
    phone: {
      type: String,
      default: '+66',
    },
    bio: {
      type: String,
      maxLength: [150, 'Password must not be more than 150 character'],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
