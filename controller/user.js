require("dotenv").config();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

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
  console.log("emial", email, psw);
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
