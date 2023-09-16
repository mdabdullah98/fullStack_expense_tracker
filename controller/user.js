require("dotenv").config();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Expense = require("../models/expense");
const Income = require("../models/income");
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
          res.cookie("token", `${user.token}`);
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
    if (user) {
      Expense.create({
        spent,
        describe,
        catagory,
        userId: user.id,
      });
    }
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
      Income.create({
        earnings,
        describe,
        userId: user.id,
      });
    }
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
