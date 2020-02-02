import express from "express";
const router = express.Router();
import userController from "../controllers/userController";

/*********************SUPERVISOR START********************************/
router.get(
  "/supervisor",
  userController.allowIfLoggedin,
  userController.grantAccess("readAny", "profile"),
  (req, res, next) => {
    res.render("sup-dash", { user: res.locals.loggedInUser });
  }
);
/*********************SUPERVISOR START********************************/

/*********************STUDENT START********************************/
router.get(
  "/student/:id",
  userController.allowIfLoggedin,
  (req, res, next) => {
    res.render("stu-dash", { user: res.locals.loggedInUser });
  }
);

router.post(
  "/updateStudent/:id",
  userController.updateStudent,
  (req, res, next) => {
    res.render("stu-dash", { user: res.locals.loggedInUser });
    next();
  }
);
/*********************STUDENT END********************************/

/*********************COORDINATOR START ***********************************/
router.get(
  "/admin/supervisors",
  userController.allowIfLoggedin,
  userController.grantAccess("readAny", "profile"),
  userController.getSupervisors,
  (req, res, next) => {
    res.render("supervisors", {
      user: res.locals.loggedInUser,
      supervisors: res.locals.supervisors
    });
  }
);

router.get(
  "/admin/add-supervisor",
  userController.allowIfLoggedin,
  userController.grantAccess("readAny", "profile"),
  (req, res, next) => {
    res.render("add-supervisor", {
      user: res.locals.loggedInUser
    });
  }
);

router.get(
  "/dashboard",
  userController.allowIfLoggedin,
  userController.grantAccess("readAny", "profile"),
  (req, res, next) => {
    res.render("coo-dash", { user: res.locals.loggedInUser });
  }
);

router.get(
  "/admin/students",
  userController.allowIfLoggedin,
  userController.grantAccess("readAny", "profile"),
  userController.getSupervisors,
  userController.getStudents,
  function(req, res, next) {
    res.render("coo-stud", {
      user: res.locals.loggedInUser,
      students: res.locals.students,
      supervisors: res.locals.supervisors
    });
  }
);

router.post(
  "/add-supervisor",
  userController.addSupervisor,
  (req, res, next) => {
    res.redirect("/admin/supervisors");
  }
);

router.post(
  "/assign-students",
  userController.assignStudents,
  (req, res, next) => {
    res.redirect("/admin/students");
  }
);

router.get(
  "/admin/supervisor/:id",
  userController.allowIfLoggedin,
  userController.grantAccess("readAny", "profile"),
  userController.getSupervisor,
  userController.getSupervisorStudents,
  (req, res, next) => {
    res.render("sup-details", {
      user: res.locals.loggedInUser,
      supervisor: res.locals.supervisor,
      students: res.locals.supervisorStudents
    });
  }
);

/********************* COORDINATOR END ***********************************/

/*********************LOGIN***********************************/
router.post("/login", userController.login, (req, res) => {
  if (req.session.user.role === "coordinator") {
    res.redirect("/dashboard");
  } else if (req.session.user.role === "supervisor") {
    res.redirect("/supervisor");
  } else {
    res.redirect("/student/" + req.session.user.id);
  }
});

router.get("/", function(req, res, next) {
  res.render("index");
});
/*********************LOGIN END***********************************/

/*********************SIGNUP START***********************************/
router.get("/signup", function(req, res, next) {
  res.render("signup");
});

router.post("/signup", userController.signup, (req, res, next) => {
  res.redirect("/student/" + req.session.user.id);
});
/*********************SIGNUP END***********************************/

// router.get(
//   "/user/:userId",
//   userController.allowIfLoggedin,
//   userController.getUser
// );

// router.get(
//   "/users",
//   userController.allowIfLoggedin,
//   userController.grantAccess("readAny", "profile"),
//   userController.getUsers
// );

// router.put(
//   "/user/:userId",
//   userController.allowIfLoggedin,
//   userController.grantAccess("updateAny", "profile"),
//   userController.updateUser
// );

// router.delete(
//   "/user/:userId",
//   userController.allowIfLoggedin,
//   userController.grantAccess("deleteAny", "profile"),
//   userController.deleteUser
// );

module.exports = router;
