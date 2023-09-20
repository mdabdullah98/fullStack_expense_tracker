require("dotenv").config();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Expense = require("../models/expense");
const Income = require("../models/income");
const Order = require("../models/order");
const jwt = require("jsonwebtoken");

const verifyJwt = (token) => {
  return jwt.verify(token, process.env.SECRET);
};

exports.signup = (req, res) => {
  const { username, email, psw } = req.body;
  try {
    const saltRounds = 10;
    var token = jwt.sign({ email: email }, process.env.SECRET);

    bcrypt.hash(psw, saltRounds, async function (err, hash) {
      // Store hash in your password DB.
      if (err) throw Error(err);
      const user = await User.create({
        username,
        email,
        psw: hash,
        token: token,
      });
      res.json({ succes: "sended succesfully" });
    });
  } catch (err) {
    console.log(err);
  }
};

exports.login = async (req, res) => {
  const { email, psw } = req.body;

  try {
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      bcrypt.compare(psw, user.psw, function (err, result) {
        if (err) throw Error(err);
        if (result) {
          res.json(user.token);
        } else {
          res.status(401).json("password is incorrect");
        }
      });
    } else {
      res.status(404).json("email does not exist");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.expense = async (req, res) => {
  const input = req.body.input;
  const { spent, describe, catagory } = input;
  const { token } = req.body;
  const { email } = verifyJwt(token);

  try {
    const user = await User.findOne({ where: { email: email } });
    const expense = await Expense.findOne({
      where: { email: email, catagory: catagory },
    });
    if (!expense) {
      const expense = await Expense.create({
        username: user.username,
        email: user.email,
        spent: +spent,
        describe,
        catagory,
        userId: user.id,
      });
    } else {
      await expense.update({
        spent: expense.spent + +spent,
        describe: describe,
      });
      await expense.save();
    }

    await user.update({ total_expense: user.total_expense + +spent });
    return user.save();

    // res.resdirect(301, "http://localhost:5173/");
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.income = async (req, res) => {
  const { input } = req.body;
  const { earnings, describe } = input;
  const { token } = req.body;
  const { email } = verifyJwt(token);
  try {
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      await Income.create({
        username: user.username,
        email: user.email,
        earnings: +earnings,
        describe,
        userId: user.id,
      });
    }
    await user.update({
      total_income: user.total_income + +earnings,
    });
    return user.save();
    // res.resdirect(301, "http://localhost:5173/");
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getExpenses = async (req, res) => {
  const token = req.get("Authorization");
  const { email } = verifyJwt(token);

  try {
    const user = await User.findOne({ where: { email: email } });
    const expenses = await Expense.findAll({ where: { userId: user.id } });
    const income = await Income.findAll({ where: { userId: user.id } });
    if (expenses || income) {
      res.status(200).json({
        expense: expenses,
        income: income,
      });
    } else {
      res.json("did not get any expenses and income");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await Expense.findByPk(id);
    if (!expense) {
      res.status(404).send("expense not found");
    }

    const deletedExpense = await expense.destroy();
    res.status(200).json(deletedExpense);
  } catch (err) {
    res.status(500).json({ err: err, message: "someting went wrong" });
  }
};

exports.getUSer = async (req, res) => {
  try {
    const token = req.get("Authorization");
    const { email } = verifyJwt(token);
    const user = await User.findOne({ where: { email: email } });
    const order = await Order.findOne({
      where: { userId: user.id, payment_status: "success" },
    });

    if (!user) {
      res.status(404).send("user not found");
    }

    res.status(200).json({
      username: user.username,
      email: user.email,
      key_ID: process.env.RAZOR_PAY_KEY_ID,
      id: user.id,
      order_id: order ? order.order_id : "",
      payment_status: order ? order.payment_status : "",
    });
  } catch (err) {
    res.status(500).json({ err: err, message: "something goes wrong" });
  }
};

exports.getAllExpenses = async (req, res) => {
  try {
    const aggregrateExpense = await User.findAll({
      attributes: ["username", "total_expense"],
      order: [["total_expense", "DESC"]],
    });

    res.status(200).json(aggregrateExpense);
  } catch (err) {
    res.status(400).json({ err: err, message: "something goes wrong" });
  }
};
