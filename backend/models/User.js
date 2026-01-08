const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  f_name: {
    type: String,
    required: true
  },
  l_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  active: {
    type: Number,
    default: 1
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", userSchema);
