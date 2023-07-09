const express = require('express');
const router = express.Router();
const Quiz = require('../../../models/quiz');
const FacultyAuthorization = require('../../../controllers/facultyAuthorisation');
const QuizAuthorization =require('../../../controllers/quizAuthorisation');
// const generateLink = require('../../../controllers/generateLink')
const User =require('../../../models/user');
const QuizQuestion = require('../../../models/quizquestion');

// Create a quiz
router.post('/quizquestion/:code',QuizAuthorization, async (req, res) => {
    const quiz=req.quiz;
    console.log(quiz.id);
    try {
        const { question, answer, explanation, questionTime, marks, sectionId, questionType, negativeMark} = req.body;
        
        // Create a new quiz in the database
        const quizQuestion = await QuizQuestion.create({
            question, 
            answer:2, explanation, questionTime, 
            mark:marks,
             sectionId, questionType, negativeMark, quizId: quiz.id,
        });
        // await quiz.addQuizQuestion(quizQuestion);
        res.status(201).json({ success: true, data: quizQuestion });
    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Get all quizzes
router.get('/quizquestion/:code',QuizAuthorization, async (req, res) => {
    try { 
        const user=req.user.id;
        // console.log(user);
        const quiz=req.quiz;
        if (quiz.id) {
        allques = await QuizQuestion.findAll({
        where: { quizId:quiz.id},
         });
        
        }
        // Sort the allquiz array in descending order based on creation time
      allques.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Fetch all quizzes from the database
        // const quizzes = await Quiz.findAll();
        res.status(200).json({ success: true, data: allques });
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

//access quiz by id
router.get('/quizzes/:code', async (req, res) => {
    try {
        const {code} = req.params;
  // Find a quiz by its code in the database
  const quiz = await Quiz.findOne({ where: { code } });
  console.log(quiz.id)
        if (quiz) {
            res.status(200).json({ success: true, data: quiz });
        } else {
            res.status(404).json({ success: false, message: 'Quiz not found' });
        }
    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// quiz updation
router.put('/quizzes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { startTime, marginTime, resultTime, quizName, sectionName, negativeMarking, preventMobile, allowTabchange} = req.body;

        // Find the quiz by ID and update its properties
        const quiz = await Quiz.findByPk(id);
        if (quiz) {
            quiz.code = code;
            quiz.startTime = startTime;
            quiz.marginTime = marginTime;
            quiz.resultTime = resultTime;
            quiz.quizName = quizName;
            quiz.sectionName = sectionName;
            quiz.creator = creator;
            quiz.negativeMarking=negativeMarking;
            quiz.preventMobile=preventMobile;
            quiz.allowTabchange=allowTabchange;
            quiz.collaborators = collaborators;

            await quiz.save();

            res.status(200).json({ success: true, data: quiz });
        } else {
            res.status(404).json({ success: false, message: 'Quiz not found' });
        }
    } catch (error) {
        console.error('Error updating quiz:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

//quiz deletion
router.delete('/quizzes', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the quiz by ID and delete it
        const quiz = await Quiz.destroy({where: {}});
        // if (quiz) {
        //     await quiz.destroy();
        //     res.status(200).json({ success: true, message: 'Quiz deleted successfully' });
        // } else {
        //     res.status(404).json({ success: false, message: 'Quiz not found' });
        // }
    } catch (error) {
        console.error('Error deleting quiz:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


//quiz deletion
router.delete('/quizzes/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the quiz by ID and delete it
        const quiz = await Quiz.findByPk(id);
        if (quiz) {
            await quiz.destroy();
            res.status(200).json({ success: true, message: 'Quiz deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Quiz not found' });
        }
    } catch (error) {
        console.error('Error deleting quiz:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

module.exports = router;