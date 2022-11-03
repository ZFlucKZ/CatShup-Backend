const asyncHandler = require('express-async-handler');
const User = require('../models/userSchema');

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please fill all require fields');
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be up to 6 characters');
  }

  // Check if user email already exist
  const userEmailExists = await User.findOne({ email });
  if (userEmailExists) {
    res.status(400);
    throw new Error('Email has already exist');
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

module.exports = {
  registerUser,
};
