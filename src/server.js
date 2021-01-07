const express = require("express");

const server = express();

server.use(express.json());

server.get("/", (req, res, next) => res.send("At least server is running!"));

const port = process.env.PORT || 3007;

server.listen(port, () =>
  console.log("This server is running on port:" + port)
);
