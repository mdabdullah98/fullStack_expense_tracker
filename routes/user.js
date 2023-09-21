const express = require("express");
const userRouter = express.Router();
const userControler = require("../controller/user");

userRouter
  .post("/user/signup", userControler.signup)
  .post("/user/login", userControler.login)
  .post("/user/expense", userControler.expense)
  .post("/user/income", userControler.income)
  .post("/user/password/forgotpassword", userControler.recoverPassword)
  .get("/user/getExpenseAndIncome", userControler.getExpenseAndIncome)
  .get("/user/getUserDeatils", userControler.getUSer)
  .get("/user/get_total_expense", userControler.getTotalExpense)
  .delete("/user/deleteExpense/:id", userControler.deleteExpense);
// .post("/user/getIncomes", userControler.getIncomes);
module.exports = userRouter;
