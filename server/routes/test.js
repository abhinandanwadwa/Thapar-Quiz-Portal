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
            marks: marksArr[randomDifficultyIndex],
            isApproved: true
        });
    };

    

    res.json({ success: "Finally bruhhhhh!" }); 
});

































// ROUTE 2: Getting no. of different level of questions from the db: GET: http://localhost:8181/api/test/noofquestions. Login Required
router.get('/noofquestions', fetchuser, async (req, res) => {
    try {
        const allQuestions = await QuestionSchema.find({ isApproved: true });
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
        const allQuestions = await QuestionSchema.find({ isApproved: true });
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

        let allEasyQuestionsArr = await QuestionSchema.find({ difficulty: "easy", isApproved: true });
        let allMediumQuestionsArr = await QuestionSchema.find({ difficulty: "medium", isApproved: true });
        let allHardQuestionsArr = await QuestionSchema.find({ difficulty: "hard", isApproved: true });

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
            ownerInstitute: theUser.institute,
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





































// ROUTE 5: Getting a particular quiz's details: GET: http://localhost:8181/api/test/getquiz/:id. Login Required
router.get('/getquiz/:id', fetchuser, async (req, res) => {
    const theUser = await UserSchema.findById(req.user.id);
    const theQuiz = await QuizSchema.findById(req.params.id, { isApproved: false });

    if (theUser.role === "student") {
        return res.status(403).json({ error: "A student cannot review the quiz" });
    }

    res.status(200).json(theQuiz);
});













































// ROUTE 6: Approving a particular quiz: PUT: http://localhost:8181/api/test/approvequiz/:id. Login Required
router.put('/approvequiz/:id', fetchuser, async (req, res) => {
    const theUser = await UserSchema.findById(req.user.id);
    if (theUser.role !== "admin") {
        return res.status(403).json({ error: "You cannot approve a quiz" });
    }

    const theQuiz = await QuizSchema.findByIdAndUpdate(req.params.id, { isApproved: true });
    res.status(200).json({ success: "The Quiz has been approved" });
});












































// ROUTE 7: Rejecting a particular quiz: PUT: http://localhost:8181/api/test/rejectquiz/:id. Login Required
router.put('/rejectquiz/:id', fetchuser, async (req, res) => {
    const theUser = await UserSchema.findById(req.user.id);
    if (theUser.role !== "admin") {
        return res.status(403).json({ error: "You cannot reject a quiz" });
    }


    const theQuiz = await QuizSchema.findById(req.params.id);
    
    const quizOwner = await UserSchema.findById(theQuiz.ownerId);


    // Sending Mail using nodemailer
    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: "abhinandanwadhwa5@outlook.com",
            pass: "Abhi1311"
        }
    });

    const options = {
        from: "abhinandanwadhwa5@outlook.com",
        to: quizOwner.email,
        subject: 'Quiz Rejected',
        html: `Hello ${theQuiz.ownerName},\nYour quiz: ${theQuiz.name} has been rejected by the admin.`
    };

    transporter.sendMail(options, (err, info) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: "Internal Server Error!" });
        }
        console.log(info.response);

        // return res.status(200).json({ success: "Email sent successfully!!" });
        res.status(200).json({ success: "The Quiz has been rejected" });
    });

    
});












































// ROUTE 8: Getting all the accepted Quiz: GET: http://localhost:8181/api/test/getallaccepted/:id. Login Required
router.get('/getallaccepted', fetchuser, async (req, res) => {
    const allQuizes = await QuizSchema.find({ isApproved: true });

    res.status(200).json(allQuizes);
});












































// ROUTE 9: Create A New Question: POST: http://localhost:8181/api/test/createquestion. Login Required
router.get('/getallaccepted', fetchuser, async (req, res) => {
    const theUser = await UserSchema.findById(req.user.id);
    if (theUser.role !== "teacher") {
        return res.status(403).json({ error: "You cannot submit a new question." });
    }

    const { statement, option1, option2, option3, option4, correctAnsIndex, difficulty } = req.body;  // Destructuring the req.body object

    let marks;
    if (difficulty === "easy") {
        marks = 1;
    }
    else if (difficulty === "medium") {
        marks = 3;
    }
    else {  // difficulty === "hard"
        marks = 5;
    }
    
    const newQuestion = await QuestionSchema.create({
        statement: req.body.statement,
        options: [option1, option2, option3, option4],
        correctAns: correctAnsIndex,
        difficulty: difficulty,
        marks: marks
    });





    // Sending Mail using nodemailer
    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: "abhinandanwadhwa5@outlook.com",
            pass: "Abhi1311"
        }
    });

    const theAdmin = await UserSchema.findOne({ role: "admin" });

    const options = {
        from: "abhinandanwadhwa5@outlook.com",
        to: theAdmin.email,
        subject: 'Question Approval Request',
        html: `Hello ${theAdmin.name},\nYou are requested verify and approve the question, created by ${theUser.name} by clicking on <a href="http://localhost:3000/approvequestion/${newQuestion.id}">this link</a>`
    };

    transporter.sendMail(options, (err, info) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: "Internal Server Error!" });
        }
        console.log(info.response);

        // return res.status(200).json({ success: "Email sent successfully!!" });
        res.status(200).json(newQuestion);
    });

});


module.exports = router;