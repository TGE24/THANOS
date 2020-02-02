"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Schema = _mongoose["default"].Schema;
var UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    "default": "student",
    "enum": ["student", "supervisor", "coordinator"]
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String
  },
  accessToken: {
    type: String
  }
}, {
  timestamps: true
});

var User = _mongoose["default"].model("user", UserSchema);

module.exports = User;