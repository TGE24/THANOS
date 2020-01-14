import express from "express";
const router = express.Router();
import userController from "../controllers/userController";

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index");
});

router.get(
  "/dashboard",
  userController.allowIfLoggedin,
  (req, res, next) => {
    res.render("coo-dash");
  }
);

// Sign Up Page
router.get("/signup", function(req, res, next) {
  res.render("signup");
});

router.post("/signup", userController.signup);

router.post("/login", userController.login, (req, res) => {
  res.redirect("/dashboard");
});

router.get(
  "/user/:userId",
  userController.allowIfLoggedin,
  userController.getUser
);

router.get(
  "/users",
  userController.allowIfLoggedin,
  userController.grantAccess("readAny", "profile"),
  userController.getUsers
);

router.put(
  "/user/:userId",
  userController.allowIfLoggedin,
  userController.grantAccess("updateAny", "profile"),
  userController.updateUser
);

router.delete(
  "/user/:userId",
  userController.allowIfLoggedin,
  userController.grantAccess("deleteAny", "profile"),
  userController.deleteUser
);

module.exports = router;
