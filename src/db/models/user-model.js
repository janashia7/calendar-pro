const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  given_name: String,
  family_name: String,
  picture: String,
  phone_number: String,
  verified: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
