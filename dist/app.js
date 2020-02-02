"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _httpErrors = _interopRequireDefault(require("http-errors"));

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _morgan = _interopRequireDefault(require("morgan"));

var _routes = _interopRequireDefault(require("./routes"));

var _db = _interopRequireDefault(require("../config/db"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _userModel = _interopRequireDefault(require("../src/models/userModel"));

var _student = _interopRequireDefault(require("../src/models/student"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _expressSession = _interopRequireDefault(require("express-session"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var app = (0, _express["default"])(); // view engine setup

app.set("views", _path["default"].join(__dirname, "views"));
app.use(_express["default"]["static"]("public"));
app.set("view engine", "ejs");
app.use((0, _morgan["default"])("dev"));
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: false
}));
app.use(_express["default"]["static"](_path["default"].join(__dirname, "../public")));
app.use(_bodyParser["default"].urlencoded({
  extended: true
}));
app.use((0, _expressSession["default"])({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SECRET_KEY,
  maxAge: Date.now() + 30 * 86400 * 1000
}));
app.use(
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res, next) {
    var accessToken, _ref2, userId, exp;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!req.session.token) {
              _context.next = 21;
              break;
            }

            accessToken = req.session.token;
            _context.next = 4;
            return _jsonwebtoken["default"].verify(accessToken, process.env.JWT_SECRET);

          case 4:
            _ref2 = _context.sent;
            userId = _ref2.userId;
            exp = _ref2.exp;

            if (!(exp < Date.now().valueOf() / 1000)) {
              _context.next = 9;
              break;
            }

            return _context.abrupt("return", res.status(401).json({
              error: "JWT token has expired, please login to obtain a new one"
            }));

          case 9:
            if (!(req.session.user.role === "student")) {
              _context.next = 15;
              break;
            }

            _context.next = 12;
            return _student["default"].findOne({
              user: userId
            }).populate("user");

          case 12:
            res.locals.loggedInUser = _context.sent;
            _context.next = 18;
            break;

          case 15:
            _context.next = 17;
            return _userModel["default"].findById(userId);

          case 17:
            res.locals.loggedInUser = _context.sent;

          case 18:
            next();
            _context.next = 22;
            break;

          case 21:
            next();

          case 22:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
app.use("/", _routes["default"]); // catch 404 and forward to error handler

app.use(function (req, res, next) {
  next((0, _httpErrors["default"])(404));
}); // error handler

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {}; // render the error page

  res.status(err.status || 500); // res.render("error");
}); // connect to db

_mongoose["default"].connect(_db["default"].database, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

_mongoose["default"].set("useFindAndModify", false);

_mongoose["default"].connection.once("open", function () {
  console.log("Database Connection Successful");
});

var _default = app;
exports["default"] = _default;