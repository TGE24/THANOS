"use strict";

var _express = _interopRequireDefault(require("express"));

var _userController = _interopRequireDefault(require("../controllers/userController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});
router.get("/dashboard", _userController["default"].allowIfLoggedin, _userController["default"].grantAccess("readAny", "profile"), function (req, res, next) {
  res.render("coo-dash", {
    user: res.locals.loggedInUser
  });
}); // Sign Up Page

router.get("/signup", function (req, res, next) {
  res.render("signup");
});
router.get("/student/?:id", function (req, res, next) {
  res.render("stu-dash", {
    user: res.locals.loggedInUser
  });
});
router.post("/signup", _userController["default"].signup, function (req, res, next) {
  if (req.session.user.role === "student") {
    res.redirect("/student/" + req.session.user._id);
  } else if (req.session.user.role === "coordinator") {
    res.redirect("/dashboard");
  } else if (req.session.user.role === "supervisor") {
    res.redirect("/supervisor");
  }
});
router.post("/student/?:id", _userController["default"].allowIfLoggedin, _userController["default"].updateStudent, function (req, res, next) {
  res.redirect("/student/" + req.session.user._id);
});
/* Group student page. */

router.get("/admin/supervisors", _userController["default"].allowIfLoggedin, _userController["default"].grantAccess("readAny", "profile"), _userController["default"].getSupervisors, function (req, res, next) {
  res.render("supervisors", {
    user: res.locals.loggedInUser,
    supervisors: res.locals.supervisors
  });
});
router.get("/admin/students", _userController["default"].allowIfLoggedin, _userController["default"].grantAccess("readAny", "profile"), _userController["default"].getStudents, function (req, res, next) {
  res.render("coo-stud", {
    user: res.locals.loggedInUser,
    students: res.locals.students
  });
});
router.post("/login", _userController["default"].login, function (req, res) {
  if (req.session.user.role === "student") {
    res.redirect("/student/" + req.session.user._id);
  } else if (req.session.user.role === "coordinator") {
    res.redirect("/dashboard");
  } else if (req.session.user.role === "supervisor") {
    res.redirect("/supervisor");
  }
});
router.get("/user/:userId", _userController["default"].allowIfLoggedin, _userController["default"].getUser);
router.get("/users", _userController["default"].allowIfLoggedin, _userController["default"].grantAccess("readAny", "profile"), _userController["default"].getUsers);
router.put("/user/:userId", _userController["default"].allowIfLoggedin, _userController["default"].grantAccess("updateAny", "profile"), _userController["default"].updateUser);
router["delete"]("/user/:userId", _userController["default"].allowIfLoggedin, _userController["default"].grantAccess("deleteAny", "profile"), _userController["default"].deleteUser);
module.exports = router;