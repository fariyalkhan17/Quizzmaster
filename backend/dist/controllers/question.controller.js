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
exports.deleteQuestion = exports.updateQuestion = exports.getQuestionById = exports.getQuestionsByQuiz = exports.createQuestion = void 0;
const models_1 = require("../models");
// Create a new question (admin only)
const createQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quizId, text, option1, option2, option3, option4, correct_option } = req.body;
        // Check if quiz exists
        const quiz = yield models_1.Quiz.findByPk(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        // Create question
        const question = yield models_1.Question.create({
            quiz_id: quizId,
            question_statement: text,
            option1,
            option2,
            option3,
            option4,
            correct_option
        });
        return res.status(201).json({
            message: 'Question created successfully',
            question
        });
    }
    catch (error) {
        console.error('Error creating question:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createQuestion = createQuestion;
// Get all questions for a quiz
const getQuestionsByQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quizId } = req.params;
        const questions = yield models_1.Question.findAll({
            where: { quiz_id: parseInt(quizId) }
        });
        return res.status(200).json(questions);
    }
    catch (error) {
        console.error('Error getting questions:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getQuestionsByQuiz = getQuestionsByQuiz;
// Get question by ID
const getQuestionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const question = yield models_1.Question.findByPk(parseInt(id));
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        return res.status(200).json(question);
    }
    catch (error) {
        console.error('Error getting question:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getQuestionById = getQuestionById;
// Update question (admin only)
const updateQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { text, option1, option2, option3, option4, correct_option, quizId } = req.body;
        const question = yield models_1.Question.findByPk(parseInt(id));
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        // If changing quiz, verify quiz exists
        if (quizId && quizId !== question.get('quiz_id')) {
            const quiz = yield models_1.Quiz.findByPk(quizId);
            if (!quiz) {
                return res.status(404).json({ message: 'Quiz not found' });
            }
        }
        yield question.update({
            question_statement: text || question.get('question_statement'),
            option1: option1 || question.get('option1'),
            option2: option2 || question.get('option2'),
            option3: option3 || question.get('option3'),
            option4: option4 || question.get('option4'),
            correct_option: correct_option || question.get('correct_option'),
            quiz_id: quizId || question.get('quiz_id')
        });
        return res.status(200).json({
            message: 'Question updated successfully',
            question
        });
    }
    catch (error) {
        console.error('Error updating question:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.updateQuestion = updateQuestion;
// Delete question (admin only)
const deleteQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const question = yield models_1.Question.findByPk(parseInt(id));
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        // Delete the question (options will be deleted due to CASCADE constraint)
        yield question.destroy();
        return res.status(200).json({ message: 'Question deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting question:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.deleteQuestion = deleteQuestion;
