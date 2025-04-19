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
exports.deleteQuiz = exports.updateQuiz = exports.getQuizById = exports.getQuizzesByChapter = exports.getAllQuizzes = exports.createQuiz = void 0;
const models_1 = require("../models");
// Create a new quiz (admin only)
const createQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, chapterId, timeLimit } = req.body;
        // Check if chapter exists
        const chapter = yield models_1.Chapter.findByPk(chapterId);
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }
        // Check if quiz exists in the chapter
        const quizExists = yield models_1.Quiz.findOne({
            where: {
                name: title,
                chapter_id: chapterId
            }
        });
        if (quizExists) {
            return res.status(400).json({ message: 'Quiz already exists in this chapter' });
        }
        const quiz = yield models_1.Quiz.create({
            name: title,
            remarks: description,
            chapter_id: chapterId,
            date_of_quiz: new Date(),
            time_duration: timeLimit || '00:30' // Default 30 minutes
        });
        return res.status(201).json({
            message: 'Quiz created successfully',
            quiz
        });
    }
    catch (error) {
        console.error('Error creating quiz:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createQuiz = createQuiz;
// Get all quizzes
const getAllQuizzes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quizzes = yield models_1.Quiz.findAll({
            include: [
                {
                    model: models_1.Chapter,
                    as: 'chapter',
                    attributes: ['id', 'name']
                }
            ]
        });
        return res.status(200).json(quizzes);
    }
    catch (error) {
        console.error('Error getting quizzes:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getAllQuizzes = getAllQuizzes;
// Get quizzes by chapter ID
const getQuizzesByChapter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chapterId } = req.params;
        const quizzes = yield models_1.Quiz.findAll({
            where: { chapter_id: parseInt(chapterId) }
        });
        return res.status(200).json(quizzes);
    }
    catch (error) {
        console.error('Error getting quizzes by chapter:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getQuizzesByChapter = getQuizzesByChapter;
// Get quiz by ID
const getQuizById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const quiz = yield models_1.Quiz.findByPk(parseInt(id), {
            include: [
                {
                    model: models_1.Chapter,
                    as: 'chapter'
                },
                {
                    model: models_1.Question,
                    as: 'questions'
                }
            ]
        });
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        return res.status(200).json(quiz);
    }
    catch (error) {
        console.error('Error getting quiz:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getQuizById = getQuizById;
// Update quiz (admin only)
const updateQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, description, chapterId, timeLimit } = req.body;
        const quiz = yield models_1.Quiz.findByPk(parseInt(id));
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        // If changing chapter, verify chapter exists
        if (chapterId && chapterId !== quiz.get('chapter_id')) {
            const chapter = yield models_1.Chapter.findByPk(chapterId);
            if (!chapter) {
                return res.status(404).json({ message: 'Chapter not found' });
            }
        }
        yield quiz.update({
            name: title || quiz.get('name'),
            remarks: description || quiz.get('remarks'),
            chapter_id: chapterId || quiz.get('chapter_id'),
            time_duration: timeLimit || quiz.get('time_duration')
        });
        return res.status(200).json({
            message: 'Quiz updated successfully',
            quiz
        });
    }
    catch (error) {
        console.error('Error updating quiz:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.updateQuiz = updateQuiz;
// Delete quiz (admin only)
const deleteQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const quiz = yield models_1.Quiz.findByPk(parseInt(id));
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        yield quiz.destroy();
        return res.status(200).json({ message: 'Quiz deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting quiz:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.deleteQuiz = deleteQuiz;
