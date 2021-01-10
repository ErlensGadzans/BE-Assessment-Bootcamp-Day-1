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

    //create exam object (const newExam) (some fields come from the body, some are generated), add questions:[]

    const newExam = {
      ...req.body,
      _id: uniqid(),
      examDate: new Date(),

      questions: [],
    };

    //generate 5 questions
    // for loop (randomIndex, newExam.questions.push(questionsDatabase[randomIndex])   )

    for (let i = 0; i < 5; i++) {
      let randomIndex = Math.floor(Math.random() * questionsDataBase.length);
      newExam.questions.push(questionsDataBase[randomIndex]);
    }

    //push to examDatabase
    examDataBase.push(newExam);

    //write back to file

    await writeFile(examFilePath, examDataBase);
    res.send("User with questions is added!");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//POST /exam/{id}/answer

router.post("/:id/answer", async (req, res, next) => {
  const examDataBase = await readFile(examFilePath);

  //1) identify exam by id
  const currentExam = examDataBase.find((exam) => exam._id === req.params.id);

  //2) identify question (use index from array)
  currentExam.questions[req.body.question].providedAnswer = req.body.answer;
  //console.log(currentExam);
  //5)add to exm obj score:0
  //const currentExam = { score: 0 };
  console.log(
    currentExam.questions[req.body.question].answers[req.body.answer]
      .providedAnswer
  );
  if (currentExam.questions[req.body.question].providedAnswer) {
    res.send("You already answered to this question");
  } else if (
    currentExam.score &&
    currentExam.questions[req.body.question].answers[req.body.answer]
      .isCorrect === true
  ) {
    currentExam.score++;
  } else if (
    !currentExam.score &&
    currentExam.questions[req.body.question].answers[req.body.answer]
      .isCorrect === true
  ) {
    currentExam.score = 1;
  } else if (
    !currentExam.score &&
    currentExam.questions[req.body.question].answers[req.body.answer]
      .isCorrect === false
  ) {
    currentExam.score = 0;
  }

  //8)write back to json
  //writeFile(examFilePath);
  await writeFile(examFilePath, examDataBase);
  res.send(examDataBase);
});

router.get("/:id", async (req, res, next) => {
  try {
    const examDataBase = await readFile(examFilePath);
    // select current exam

    const selectedExam = await examDataBase.find(
      (exam) => exam._id === req.params.id
    );
    console.log(selectedExam);
    res.send(selectedExam);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
