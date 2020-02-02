"use strict";

var _userModel = _interopRequireDefault(require("../models/userModel"));

var _student = _interopRequireDefault(require("../models/student"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _roles = require("../helpers/roles");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function hashPassword(_x) {
  return _hashPassword.apply(this, arguments);
}

function _hashPassword() {
  _hashPassword = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee12(password) {
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return _bcrypt["default"].hash(password, 10);

          case 2:
            return _context12.abrupt("return", _context12.sent);

          case 3:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));
  return _hashPassword.apply(this, arguments);
}

function validatePassword(_x2, _x3) {
  return _validatePassword.apply(this, arguments);
}

function _validatePassword() {
  _validatePassword = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee13(plainPassword, hashedPassword) {
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return _bcrypt["default"].compare(plainPassword, hashedPassword);

          case 2:
            return _context13.abrupt("return", _context13.sent);

          case 3:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));
  return _validatePassword.apply(this, arguments);
}

exports.signup =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res, next) {
    var _req$body, name, email, password, role, phone, hashedPassword, newUser, accessToken;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _req$body = req.body, name = _req$body.name, email = _req$body.email, password = _req$body.password, role = _req$body.role, phone = _req$body.phone;
            _context.next = 4;
            return hashPassword(password);

          case 4:
            hashedPassword = _context.sent;
            newUser = new _userModel["default"]({
              name: name,
              email: email,
              phone: phone,
              password: hashedPassword,
              role: role || "student"
            });
            accessToken = _jsonwebtoken["default"].sign({
              userId: newUser._id
            }, process.env.JWT_SECRET, {
              expiresIn: "1d"
            });
            newUser.accessToken = accessToken;
            _context.next = 10;
            return newUser.save();

          case 10:
            req.session.token = accessToken;
            req.session.user = newUser;
            res.status(200);
            next();
            _context.next = 19;
            break;

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](0);
            next(_context.t0);

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 16]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref.apply(this, arguments);
  };
}();

exports.login =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res, next) {
    var _req$body2, email, password, user, validPassword, accessToken;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
            _context2.next = 4;
            return _userModel["default"].findOne({
              email: email
            });

          case 4:
            user = _context2.sent;

            if (user) {
              _context2.next = 7;
              break;
            }

            return _context2.abrupt("return", next(new Error("Email does not exist")));

          case 7:
            _context2.next = 9;
            return validatePassword(password, user.password);

          case 9:
            validPassword = _context2.sent;

            if (validPassword) {
              _context2.next = 12;
              break;
            }

            return _context2.abrupt("return", next(new Error("Password is not correct")));

          case 12:
            accessToken = _jsonwebtoken["default"].sign({
              userId: user._id
            }, process.env.JWT_SECRET, {
              expiresIn: "1d"
            });
            _context2.next = 15;
            return _userModel["default"].findByIdAndUpdate(user._id, {
              accessToken: accessToken
            });

          case 15:
            req.session.token = accessToken;
            req.session.user = user;
            res.status(200);
            next();
            _context2.next = 24;
            break;

          case 21:
            _context2.prev = 21;
            _context2.t0 = _context2["catch"](0);
            next(_context2.t0);

          case 24:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 21]]);
  }));

  return function (_x7, _x8, _x9) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getUsers =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(req, res, next) {
    var users;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _userModel["default"].find({});

          case 2:
            users = _context3.sent;
            res.status(200).json({
              data: users
            });

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x10, _x11, _x12) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getSupervisors =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(req, res, next) {
    var role, _users;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            role = {
              role: "supervisor"
            };
            _context4.next = 4;
            return _userModel["default"].find(role);

          case 4:
            _users = _context4.sent;

            if (_users) {
              _context4.next = 7;
              break;
            }

            return _context4.abrupt("return", next(new Error("No supervisor found")));

          case 7:
            res.locals.supervisors = _users;
            res.status(200);
            next();
            _context4.next = 15;
            break;

          case 12:
            _context4.prev = 12;
            _context4.t0 = _context4["catch"](0);
            next(_context4.t0);

          case 15:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 12]]);
  }));

  return function (_x13, _x14, _x15) {
    return _ref4.apply(this, arguments);
  };
}();

exports.getStudents =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(req, res, next) {
    var _users2;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return _student["default"].find({}).populate("user");

          case 3:
            _users2 = _context5.sent;

            if (_users2) {
              _context5.next = 6;
              break;
            }

            return _context5.abrupt("return", next(new Error("No student found")));

          case 6:
            res.locals.students = _users2;
            res.status(200);
            next();
            _context5.next = 14;
            break;

          case 11:
            _context5.prev = 11;
            _context5.t0 = _context5["catch"](0);
            next(_context5.t0);

          case 14:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 11]]);
  }));

  return function (_x16, _x17, _x18) {
    return _ref5.apply(this, arguments);
  };
}();

exports.getUser =
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(req, res, next) {
    var userId, user;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            userId = req.params.userId;
            _context6.next = 4;
            return _userModel["default"].findById(userId);

          case 4:
            user = _context6.sent;

            if (user) {
              _context6.next = 7;
              break;
            }

            return _context6.abrupt("return", next(new Error("User does not exist")));

          case 7:
            res.locals.user = users;
            res.status(200);
            next();
            _context6.next = 15;
            break;

          case 12:
            _context6.prev = 12;
            _context6.t0 = _context6["catch"](0);
            next(_context6.t0);

          case 15:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 12]]);
  }));

  return function (_x19, _x20, _x21) {
    return _ref6.apply(this, arguments);
  };
}();

exports.updateStudent =
/*#__PURE__*/
function () {
  var _ref7 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee7(req, res, next) {
    var update, userId, student;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            update = req.body;
            userId = req.params.id;
            update.user = userId;
            console.log(req.params);
            _context7.next = 7;
            return _student["default"].findOneAndUpdate({
              user: userId
            }, update, {
              upsert: true,
              "new": true
            }).populate("user");

          case 7:
            student = _context7.sent;
            res.locals.user = student;
            res.status(200);
            next();
            _context7.next = 16;
            break;

          case 13:
            _context7.prev = 13;
            _context7.t0 = _context7["catch"](0);
            next(_context7.t0);

          case 16:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[0, 13]]);
  }));

  return function (_x22, _x23, _x24) {
    return _ref7.apply(this, arguments);
  };
}();

exports.updateUser =
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee8(req, res, next) {
    var update, userId, user;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            update = req.body;
            userId = req.params.userId;
            _context8.next = 5;
            return _userModel["default"].findByIdAndUpdate(userId, update);

          case 5:
            _context8.next = 7;
            return _userModel["default"].findById(userId);

          case 7:
            user = _context8.sent;
            res.status(200).json({
              data: user,
              message: "User has been updated"
            });
            _context8.next = 14;
            break;

          case 11:
            _context8.prev = 11;
            _context8.t0 = _context8["catch"](0);
            next(_context8.t0);

          case 14:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 11]]);
  }));

  return function (_x25, _x26, _x27) {
    return _ref8.apply(this, arguments);
  };
}();

exports.deleteUser =
/*#__PURE__*/
function () {
  var _ref9 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee9(req, res, next) {
    var userId;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;
            userId = req.params.userId;
            _context9.next = 4;
            return _userModel["default"].findByIdAndDelete(userId);

          case 4:
            res.status(200).json({
              data: null,
              message: "User has been deleted"
            });
            _context9.next = 10;
            break;

          case 7:
            _context9.prev = 7;
            _context9.t0 = _context9["catch"](0);
            next(_context9.t0);

          case 10:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[0, 7]]);
  }));

  return function (_x28, _x29, _x30) {
    return _ref9.apply(this, arguments);
  };
}();

exports.grantAccess = function (action, resource) {
  return (
    /*#__PURE__*/
    function () {
      var _ref10 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee10(req, res, next) {
        var permission;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.prev = 0;
                permission = _roles.roles.can(req.user.role)[action](resource);

                if (permission.granted) {
                  _context10.next = 4;
                  break;
                }

                return _context10.abrupt("return", res.status(401).json({
                  error: "You don't have enough permission to perform this action"
                }));

              case 4:
                next();
                _context10.next = 10;
                break;

              case 7:
                _context10.prev = 7;
                _context10.t0 = _context10["catch"](0);
                next(_context10.t0);

              case 10:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, null, [[0, 7]]);
      }));

      return function (_x31, _x32, _x33) {
        return _ref10.apply(this, arguments);
      };
    }()
  );
};

exports.allowIfLoggedin =
/*#__PURE__*/
function () {
  var _ref11 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee11(req, res, next) {
    var user;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            try {
              user = res.locals.loggedInUser;
              if (!user) res.redirect("/");
              req.user = user;
              next();
            } catch (error) {
              next(error);
            }

          case 1:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));

  return function (_x34, _x35, _x36) {
    return _ref11.apply(this, arguments);
  };
}();