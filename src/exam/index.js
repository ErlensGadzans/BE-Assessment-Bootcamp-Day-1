const express = require("express");
const fs = require("fs-extra");
const path = require("path");
const uniqid = require("uniqid");

const router = express.Router();

const examFilePath = path.join(__dirname, "exam.json");
const questionsFilePath = path.join(__dirname, "../questions/questions.json");

const readFile = async (path) => {
  const json = await fs.readJSON(path); // reading Json file as a buffer
  return json;
};

const writeFile = async (filePath, content) => {
  await fs.writeJSON(filePath, content);
};

// //GET ARRAY OF EXAM
// router.get("/", async (req, res, next) => {
//   res.send(await readFile(examFilePath));
// });

//POST USER WITH LISTED QUESTIONS, WHO WILL PARITICIPATE IN EXAM
router.post("/start", async (req, res, next) => {
  try {
    // RECEIVE EXAM AND QUESTIONS
    const examDataBase = await readFile(examFilePath);
    const questionsDataBase = await readFile(questionsFilePath);
    console.log(examDataBase);
    //create exam object (const newExam) (some fields come from the body, some are generated), add questions:[]

    const newExam = {
      ...req.body,
      _id: uniqid(),
      examDate: new Date(),
      questions: [],
    };
    console.log(newExam);
    //generate 5 questions
    // for loop (randomIndex, newExam.questions.push(questionsDatabase[randomIndex])   )

    for (let i = 0; i < 5; i++) {
      let randomIndex = Math.floor(Math.random() * questionsDataBase.length);
      newExam.questions.push(questionsDataBase[randomIndex]);
    }
    console.log(newExam);
    //push to examDatabase
    examDataBase.push(newExam);
    //write back to file
    console.log(examDataBase);
    await writeFile(examFilePath, examDataBase);
    res.send("User with questions is added!");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
