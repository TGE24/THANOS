import User from "../models/userModel";
import Student from "../models/student";
import Assign from "../models/assigned";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { roles } from "../helpers/roles";

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, regNo, role, phone } = req.body;
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      name,
      email,
      phone,
      regNo,
      password: hashedPassword,
      role: role || "student"
    });
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );
    newUser.accessToken = accessToken;
    await newUser.save();
    req.session.token = accessToken;
    req.session.user = newUser;
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.addSupervisor = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "supervisor"
    });
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );
    newUser.accessToken = accessToken;
    await newUser.save();
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new Error("Email does not exist"));
    const validPassword = await validatePassword(
      password,
      user.password
    );
    if (!validPassword)
      return next(new Error("Password is not correct"));
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );
    await User.findByIdAndUpdate(user._id, { accessToken });
    req.session.token = accessToken;
    req.session.user = user;
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    data: users
  });
};

exports.getSupervisors = async (req, res, next) => {
  try {
    const role = { role: "supervisor" };
    const users = await User.find(role);
    if (!users) return next(new Error("No supervisor found"));
    res.locals.supervisors = users;
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.getSupervisor = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new Error("No supervisor found"));
    res.locals.supervisor = user;
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.getSupervisorStudents = async (req, res, next) => {
  try {
    const supervisorId = { supervisorId: req.params.id };
    const students = await Assign.find(supervisorId);
    const usersArray = [];
    for (let index = 0; index < students.length; index++) {
      const student = students[index].student;
      const users = await User.findById(student);
      usersArray.push(users);
    }
    res.locals.supervisorStudents = usersArray;
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.getStudents = async (req, res, next) => {
  try {
    const role = { role: "student" };
    const users = await User.find(role);
    if (!users) return next(new Error("No student found"));
    res.locals.students = users;
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};
exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) return next(new Error("User does not exist"));
    res.locals.user = users;
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const update = req.body;
    const userId = req.params.userId;
    await User.findByIdAndUpdate(userId, update);
    const user = await User.findById(userId);
    res.status(200).json({
      data: user,
      message: "User has been updated"
    });
  } catch (error) {
    next(error);
  }
};

exports.updateStudent = async (req, res, next) => {
  try {
    const update = req.body;
    const userId = req.params.id;
    await Student.findOneAndUpdate({ user: userId }, update, {
      upsert: true
    });
    const user = await Student.findOne({ user: userId }).populate(
      "user"
    );
    // res.locals.loggedInUser = user
    res.status(200);
    res.redirect("/student/" + userId);
    next();
  } catch (error) {
    next(error);
  }
};

exports.assignStudents = async (req, res, next) => {
  try {
    const { supervisorId, studentId } = req.body;
    if (typeof studentId === "object") {
      for (let index = 0; index < studentId.length; index++) {
        const student = studentId[index];
        const user = await Assign.findOne({ student });
        if (user) {
          console.log("Student has been assigned already");
          return next(new Error("Student has been assigned already"));
        } else {
          const newAssigned = new Assign({
            supervisorId,
            student
          });
          await newAssigned.save();
        }
      }
    } else {
      const student = studentId;
      const user = await Assign.findOne({ student });
      if (user) {
        console.log("Student has been assigned already");
        return next(new Error("Student has been assigned already"));
      } else {
        const newAssigned = new Assign({
          supervisorId,
          student
        });
        await newAssigned.save();
      }
      res.status(200);
      res.redirect("/admin/students");
      next();
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    await User.findByIdAndDelete(userId);
    res.status(200).json({
      data: null,
      message: "User has been deleted"
    });
  } catch (error) {
    next(error);
  }
};

exports.grantAccess = function(action, resource) {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
        return res.status(401).json({
          error:
            "You don't have enough permission to perform this action"
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

exports.allowIfLoggedin = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    if (!user) res.redirect("/");
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
