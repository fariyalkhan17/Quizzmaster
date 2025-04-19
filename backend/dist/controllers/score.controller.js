"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllScores = exports.getScoresByQuiz = exports.getUserStats = exports.getUserScores = exports.submitQuiz = void 0;
const models_1 = require("../models");
// Submit a quiz and calculate score
const submitQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const { quiz_id, answers, time_taken } = req.body;
        // Check if quiz exists
        const quiz = yield models_1.Quiz.findByPk(quiz_id, {
            include: [
                {
                    model: models_1.Question,
                    as: 'questions'
                }
            ]
        });
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        // Get all questions for the quiz
        const questions = yield models_1.Question.findAll({
            where: { quiz_id }
        });
        if (questions.length === 0) {
            return res.status(400).json({ message: 'No questions found for this quiz' });
        }
        // Calculate score
        let correctAnswers = 0;
        for (const answer of answers) {
            const question = questions.find(q => q.get('id') === answer.question_id);
            if (question && question.get('correct_option') === answer.selected_option) {
                correctAnswers++;
            }
        }
        const totalQuestions = questions.length;
        const percentageScore = (correctAnswers / totalQuestions) * 100;
        // Create score record
        const score = yield models_1.Score.create({
            quiz_id,
            user_id: id,
            time_stamp_of_attempt: new Date(),
            total_questions: totalQuestions,
            total_scored: correctAnswers,
            time_taken
        });
        return res.status(201).json({
            message: 'Quiz submitted successfully',
            score,
            percentage: percentageScore
        });
    }
    catch (error) {
        console.error('Error submitting quiz:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.submitQuiz = submitQuiz;
// Get scores for the logged-in user
const getUserScores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const scores = yield models_1.Score.findAll({
            where: { user_id: id },
            include: [
                {
                    model: models_1.Quiz,
                    as: 'quiz'
                }
            ],
            order: [['time_stamp_of_attempt', 'DESC']]
        });
        return res.status(200).json(scores);
    }
    catch (error) {
        console.error('Error getting user scores:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getUserScores = getUserScores;
// Get stats for the logged-in user
const getUserStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const scores = yield models_1.Score.findAll({
            where: { user_id: id }
        });
        if (scores.length === 0) {
            return res.status(200).json({
                totalQuizzes: 0,
                totalQuestions: 0,
                totalCorrect: 0,
                averageScore: 0
            });
        }
        const totalQuizzes = scores.length;
        const totalQuestions = scores.reduce((sum, score) => sum + score.get('total_questions'), 0);
        const totalCorrect = scores.reduce((sum, score) => sum + score.get('total_scored'), 0);
        const averageScore = (totalCorrect / totalQuestions) * 100;
        return res.status(200).json({
            totalQuizzes,
            totalQuestions,
            totalCorrect,
            averageScore: Math.round(averageScore * 100) / 100
        });
    }
    catch (error) {
        console.error('Error getting user stats:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getUserStats = getUserStats;
// Get scores by quiz (admin only)
const getScoresByQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quizId } = req.params;
        const scores = yield models_1.Score.findAll({
            where: { quiz_id: parseInt(quizId) },
            include: [
                {
                    model: models_1.User,
                    as: 'user',
                    attributes: ['id', 'username', 'fullName']
                }
            ],
            order: [['time_stamp_of_attempt', 'DESC']]
        });
        return res.status(200).json(scores);
    }
    catch (error) {
        console.error('Error getting scores by quiz:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getScoresByQuiz = getScoresByQuiz;
// Get all scores (admin only)
const getAllScores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const scores = yield models_1.Score.findAll({
            include: [
                {
                    model: models_1.Quiz,
                    as: 'quiz'
                },
                {
                    model: models_1.User,
                    as: 'user',
                    attributes: ['id', 'username', 'fullName']
                }
            ],
            order: [['time_stamp_of_attempt', 'DESC']]
        });
        return res.status(200).json(scores);
    }
    catch (error) {
        console.error('Error getting all scores:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getAllScores = getAllScores;
