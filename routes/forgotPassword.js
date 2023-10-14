const express = require("express");
const forgotPasswordRouter = express.Router();
const ForgotPasswordController = require("../controller/forgotPassword");

forgotPasswordRouter
  .get(
    "/password/authenticate_link/:id",
    ForgotPasswordController.authenticateLink
  ).get(
    "/user/password/reset_password/:id",
    ForgotPasswordController.showReserForm
  )
  .post("/password/forgotpassword", ForgotPasswordController.ForgotPassword)
  .post(
    "/password/update_password/:id",
    ForgotPasswordController.updatePassword
  );
module.exports = forgotPasswordRouter;
