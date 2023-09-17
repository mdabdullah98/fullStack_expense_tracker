const express = require("express");
const userRouter = express.Router();
const userControler = require("../controller/user");

userRouter
  .post("/user/signup", userControler.signup)
  .post("/user/login", userControler.login)
  .post("/user/expense", userControler.expense)
  .post("/user/income", userControler.income)
  .get("/user/getExpenseAndIncome", userControler.getExpenses)
  .get("/user/getUserDeatils", userControler.getUSer)
  .delete("/user/deleteExpense/:id", userControler.deleteExpense);
// .post("/user/getIncomes", userControler.getIncomes);
module.exports = userRouter;
