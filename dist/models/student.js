"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Schema = _mongoose["default"].Schema;
var StudentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  regNo: {
    type: String,
    lowercase: true
  }
});

var Student = _mongoose["default"].model("student", StudentSchema);

module.exports = Student;