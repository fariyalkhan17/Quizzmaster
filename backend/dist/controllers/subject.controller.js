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
exports.deleteSubject = exports.updateSubject = exports.getSubjectById = exports.getAllSubjects = exports.createSubject = void 0;
const models_1 = require("../models");
// Create a new subject (admin only)
const createSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description } = req.body;
        // Check if subject exists
        const subjectExists = yield models_1.Subject.findOne({ where: { name } });
        if (subjectExists) {
            return res.status(400).json({ message: 'Subject already exists' });
        }
        const subject = yield models_1.Subject.create({
            name,
            description
        });
        return res.status(201).json({
            message: 'Subject created successfully',
            subject
        });
    }
    catch (error) {
        console.error('Error creating subject:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createSubject = createSubject;
// Get all subjects
const getAllSubjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subjects = yield models_1.Subject.findAll({
            include: [
                {
                    model: models_1.Chapter,
                    as: 'chapters'
                }
            ]
        });
        return res.status(200).json(subjects);
    }
    catch (error) {
        console.error('Error getting subjects:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getAllSubjects = getAllSubjects;
// Get subject by ID
const getSubjectById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const subject = yield models_1.Subject.findByPk(parseInt(id), {
            include: [
                {
                    model: models_1.Chapter,
                    as: 'chapters'
                }
            ]
        });
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        return res.status(200).json(subject);
    }
    catch (error) {
        console.error('Error getting subject:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getSubjectById = getSubjectById;
// Update subject (admin only)
const updateSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const subject = yield models_1.Subject.findByPk(parseInt(id));
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        yield subject.update({
            name: name || subject.get('name'),
            description: description || subject.get('description')
        });
        return res.status(200).json({
            message: 'Subject updated successfully',
            subject
        });
    }
    catch (error) {
        console.error('Error updating subject:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.updateSubject = updateSubject;
// Delete subject (admin only)
const deleteSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const subject = yield models_1.Subject.findByPk(parseInt(id));
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        yield subject.destroy();
        return res.status(200).json({ message: 'Subject deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting subject:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.deleteSubject = deleteSubject;
