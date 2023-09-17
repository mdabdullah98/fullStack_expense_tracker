const express = require("express");
const sequelize = require("./utils/databse");
const User = require("./models/user");
const Expense = require("./models/expense");
const Income = require("./models/income");
const Order = require("./models/order");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const server = express();
const Port = 8080 || process.env.Port;

server.use(cors());
server.use(cookieParser());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use("/", userRouter);
server.use("/api/user", paymentRouter);

//sql realtion over here
User.hasMany(Expense, { onDelete: "CASCADE" });
Expense.belongsTo(User);
User.hasMany(Income, { onDelete: "CASCADE" });
Income.belongsTo(User);
User.hasMany(Order, { onDelete: "CASCADE" });
Order.belongsTo(User);

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
