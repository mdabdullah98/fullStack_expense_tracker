const express = require("express");
const sequelize = require("./utils/databse");
const User = require("./models/user");
const Expense = require("./models/expense");
const Income = require("./models/income");
const userRouter = require("./routes/user");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const server = express();
const Port = 8080 || process.env.Port;

server.use(cors());
server.use(cookieParser());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use("/", userRouter);

User.hasMany(Expense, { onDelete: "CASCADE" });
Expense.belongsTo(User);
User.hasMany(Income, { onDelete: "CASCADE" });
Income.belongsTo(User);

sequelize
  .sync()
  .then((res) => {
    server.listen(Port, () => {
      console.log(`server is running on port http://localhost:${Port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
