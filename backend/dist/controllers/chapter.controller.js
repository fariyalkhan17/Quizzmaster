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
exports.deleteChapter = exports.updateChapter = exports.getChapterById = exports.getChaptersBySubject = exports.getAllChapters = exports.createChapter = void 0;
const models_1 = require("../models");
// Create a new chapter (admin only)
const createChapter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, subjectId } = req.body;
        // Check if subject exists
        const subject = yield models_1.Subject.findByPk(subjectId);
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        // Check if chapter exists in the subject
        const chapterExists = yield models_1.Chapter.findOne({
            where: {
                name,
                subject_id: subjectId
            }
        });
        if (chapterExists) {
            return res.status(400).json({ message: 'Chapter already exists in this subject' });
        }
        const chapter = yield models_1.Chapter.create({
            name,
            description,
            subject_id: subjectId
        });
        return res.status(201).json({
            message: 'Chapter created successfully',
            chapter
        });
    }
    catch (error) {
        console.error('Error creating chapter:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createChapter = createChapter;
// Get all chapters
const getAllChapters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chapters = yield models_1.Chapter.findAll({
            include: [
                {
                    model: models_1.Subject,
                    as: 'subject'
                },
                {
                    model: models_1.Quiz,
                    as: 'quizzes'
                }
            ]
        });
        return res.status(200).json(chapters);
    }
    catch (error) {
        console.error('Error getting chapters:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getAllChapters = getAllChapters;
// Get chapters by subject ID
const getChaptersBySubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subjectId } = req.params;
        const chapters = yield models_1.Chapter.findAll({
            where: { subject_id: parseInt(subjectId) },
            include: [
                {
                    model: models_1.Quiz,
                    as: 'quizzes'
                }
            ]
        });
        return res.status(200).json(chapters);
    }
    catch (error) {
        console.error('Error getting chapters by subject:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getChaptersBySubject = getChaptersBySubject;
// Get chapter by ID
const getChapterById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const chapter = yield models_1.Chapter.findByPk(parseInt(id), {
            include: [
                {
                    model: models_1.Subject,
                    as: 'subject'
                },
                {
                    model: models_1.Quiz,
                    as: 'quizzes'
                }
            ]
        });
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }
        return res.status(200).json(chapter);
    }
    catch (error) {
        console.error('Error getting chapter:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getChapterById = getChapterById;
// Update chapter (admin only)
const updateChapter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, description, subjectId } = req.body;
        const chapter = yield models_1.Chapter.findByPk(parseInt(id));
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }
        // If changing subject, verify subject exists
        if (subjectId && subjectId !== chapter.get('subject_id')) {
            const subject = yield models_1.Subject.findByPk(subjectId);
            if (!subject) {
                return res.status(404).json({ message: 'Subject not found' });
            }
        }
        yield chapter.update({
            name: name || chapter.get('name'),
            description: description || chapter.get('description'),
            subject_id: subjectId || chapter.get('subject_id')
        });
        return res.status(200).json({
            message: 'Chapter updated successfully',
            chapter
        });
    }
    catch (error) {
        console.error('Error updating chapter:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.updateChapter = updateChapter;
// Delete chapter (admin only)
const deleteChapter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const chapter = yield models_1.Chapter.findByPk(parseInt(id));
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }
        yield chapter.destroy();
        return res.status(200).json({ message: 'Chapter deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting chapter:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.deleteChapter = deleteChapter;
