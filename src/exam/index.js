const express = require("express");
const fs = require("fs-extra");
const path = require("path");

const router = express.Router();

const examFilePath = path.join(__dirname, "exam.json");
const questionsFilePath = path.join(__dirname, "../questions/questions.json");

const readFile = async (path) => {
  const buffer = await fs.readFile(path); // reading Json file as a buffer
  const text = buffer.toString(); //transforming buffer file to string
  return JSON.parse(text); //returns content of the file
};

const writeFile = async (content) => {
  await fs.writeFile(examFilePath, JSON.stringify(content));
};

//GET ARRAY OF EXAM
router.get("/", async (req, res, next) => {
  res.send(await readFile(examFilePath));
});

module.exports = router;
