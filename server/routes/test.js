// API KEY => a7437a0f67653d46fc0fa1d870f8e1f0ba4f5996
const express = require('express');
const router = express.Router();
const UserSchema = require('../models/User');
const QuizSchema = require('../models/Quiz');
const QuestionSchema = require('../models/Question');
const { body, validationResult, check } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const dotenv = require('dotenv');
const request = require('request');
const nodemailer = require("nodemailer");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;


const allQuestions = [];


// Route 1: Registering Questions: GET: http://localhost:8181/api/test/epicshit. No Login Required
router.get("/epicshit", async (req, res) => {
    // API URL => https://mcq-quiz-app.herokuapp.com/getBulk/a7437a0f67653d46fc0fa1d870f8e1f0ba4f5996/100
    // allQuestions.forEach(question => {
    for (let i = 0; i<allQuestions.length; i++) {
        let question = allQuestions[i];
        let ca = question.answer;
        let correctAnsIndex;
        let optionsArr = [question.option1, question.option2, question.option3, question.option4];
        // optionsArr.forEach(element => {
        //     if (ca === element) {
        //         correctAnsIndex = element
        //     }
        // });
        for(let i=0; i<4; i++) {
            if (ca === optionsArr[i]) {
                correctAnsIndex = i;
            }
        }

        const difficultyArr = ['easy', 'medium', 'hard'];

        let randomDifficultyIndex = Math.floor(Math.random() * (3));

        const marksArr = [1, 3, 5];

        const newQuestion = await QuestionSchema.create({
            statement: question.question,
            options: optionsArr,
            correctAns: correctAnsIndex,
            difficulty: difficultyArr[randomDifficultyIndex],
            marks: marksArr[randomDifficultyIndex]
        });
    };

    

    res.json({ success: "Finally bruhhhhh!" }); 
});

































// ROUTE 2: Getting no. of different level of questions from the db: GET: http://localhost:8181/api/test/noofquestions. Login Required
router.get('/noofquestions', fetchuser, async (req, res) => {
    try {
        const allQuestions = await QuestionSchema.find();
        let ez = 0;
        let md = 0;
        let hd = 0;

        allQuestions.forEach(question => {
            if (question.difficulty === "easy") {
                ez++;
            }
            else if (question.difficulty === "medium") {
                md++;
            }
            else {
                // question.difficulty === "hard"
                hd++;
            }
        });

        res.json({ easy: ez, medium: md, hard: hd });

    } catch (error) {
        console.error(error);
    }
});

































// ROUTE 3: Getting all questions from the db: GET: http://localhost:8181/api/test/getallquestions. Login Required
router.get('/getallquestions', fetchuser, async (req, res) => {
    try {
        const allQuestions = await QuestionSchema.find();
        res.json(allQuestions);

    } catch (error) {
        console.error(error);
    }
});

































// ROUTE 4: Submitting a New Quiz: POST: http://localhost:8181/api/test/submitquiz. Login Required
router.post('/submitquiz', fetchuser, async (req, res) => {
    try {
        const theUser = await UserSchema.findById(req.user.id);
        if (theUser.role === "student") {
            return res.status(403).json({ error: "Students cannot submit a quiz" });
        }

        let allEasyQuestionsArr = await QuestionSchema.find({ difficulty: "easy" });
        let allMediumQuestionsArr = await QuestionSchema.find({ difficulty: "medium" });
        let allHardQuestionsArr = await QuestionSchema.find({ difficulty: "hard" });

        // const noOfEasy = allEasyQuestionsArr.length;
        // const noOfMedium = allMediumQuestionsArr.length;
        // const noOfHard = allHardQuestionsArr.length;
        
        const getFinalArr = (noOfCategoryQuestions, allCategoryQuestionsArr) => {
            let finalIndexes = [];
            while (finalIndexes.length !== noOfCategoryQuestions) {
                let rand = Math.floor(Math.random() * (allCategoryQuestionsArr.length));
                if (!finalIndexes.includes(rand)) {
                    finalIndexes.push(rand);
                }
            }
            let finalCatQuestionsArr = [];
            finalIndexes.forEach(element => {
                finalCatQuestionsArr.push(allCategoryQuestionsArr[element]);
            });

            return finalCatQuestionsArr;
        }



        const finalEasy = getFinalArr(req.body.noOfEasyQuestions, allEasyQuestionsArr);
        const finalMedium = getFinalArr(req.body.noOfMediumQuestions, allMediumQuestionsArr);
        const finalHard = getFinalArr(req.body.noOfHardQuestions, allHardQuestionsArr);
        

        const newQuiz = await QuizSchema.create({
            name: req.body.name,
            start: req.body.start,
            end: req.body.end,
            ownerName: theUser.name,
            ownerId: req.user.id,
            totalMarks: req.body.totalMarks,
            easyQuestions: finalEasy,
            mediumQuestions: finalMedium,
            hardQuestions: finalHard,
        });

        // Sending Mail using nodemailer
        const transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: "abhinandanwadhwa5@outlook.com",
                pass: "Abhi1311"
            }
        });
    
        const admin = await UserSchema.find({ role: "admin" });

        const options = {
            from: "abhinandanwadhwa5@outlook.com",
            to: admin[0].email,
            subject: 'Quiz Approval Request',
            html: `Hello ${admin[0].name},\nYou are requested verify and approve the quiz, created by ${theUser.name} by clicking on <a href="http://localhost:3000/approve/${newQuiz.id}">this link</a>`
        };
    
        transporter.sendMail(options, (err, info) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ error: "Internal Server Error!" });
            }
            console.log(info.response);
    
            // return res.status(200).json({ success: "Email sent successfully!!" });
            return res.status(200).json(newQuiz);
        })

        // res.status(200).json(newQuiz);
        // for (let i = 0; i < finalEasyIndexes.length; i++) {
        //     const element = finalEasyIndexes[i];
        //     if (element === rand) {
        //         rand = Math.floor(Math.random() * (allEasyQuestionsArr.length)); 
        //         continue;
        //     }
        // }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;