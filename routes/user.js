const express = require("express");
const userRouter = express.Router();
const userControler = require("../controller/user");

userRouter
  .post("/user/signup", userControler.signup)
  .post("/user/login", userControler.login);
module.exports = userRouter;
