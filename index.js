const express = require("express");
const sequelize = require("./utils/databse");
const User = require("./models/user");
const userRouter = require("./routes/user");
const cors = require("cors");

const server = express();
const Port = 8080 || process.env.Port;

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use("/", userRouter);

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
