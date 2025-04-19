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
exports.deleteUser = exports.updateProfile = exports.getProfile = exports.getAllUsers = void 0;
const models_1 = require("../models");
// Get all users (for admin)
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield models_1.User.findAll({
            attributes: { exclude: ['password'] }
        });
        return res.status(200).json(users);
    }
    catch (error) {
        console.error('Error getting users:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getAllUsers = getAllUsers;
// Get user profile
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const user = yield models_1.User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        console.error('Error getting profile:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getProfile = getProfile;
// Update user profile
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.user;
        const { fullName, qualification, dob } = req.body;
        const user = yield models_1.User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Update fields
        yield user.update({
            fullName: fullName || user.get('fullName'),
            qualification: qualification || user.get('qualification'),
            dob: dob || user.get('dob')
        });
        // Remove password from response
        const userResponse = user.toJSON();
        delete userResponse.password;
        return res.status(200).json({
            message: 'Profile updated successfully',
            user: userResponse
        });
    }
    catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.updateProfile = updateProfile;
// Delete user (admin only)
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield models_1.User.findByPk(parseInt(id));
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Admin can't be deleted
        if (user.get('role') === 'admin') {
            return res.status(403).json({ message: 'Admin user cannot be deleted' });
        }
        yield user.destroy();
        return res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.deleteUser = deleteUser;
