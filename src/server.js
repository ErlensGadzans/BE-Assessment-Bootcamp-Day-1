const express = require("express");
require("dotenv").config(); // telling to read .env file

const examRouter = require("./exam");

const server = express();

server.use(express.json());

server.get("/", (req, res, next) => res.send("At least server is running!"));
server.use("/exam", examRouter);

const port = process.env.PORT || 3007;

server.listen(port, () =>
  console.log("This server is running on port:" + port)
);
