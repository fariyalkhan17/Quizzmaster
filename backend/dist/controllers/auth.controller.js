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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const models_1 = require("../models");
// Register a new user
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, fullName, qualification, dob } = req.body;
        // Check if user already exists
        const userExists = yield models_1.User.findOne({ where: { username } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create user
        const user = yield models_1.User.create({
            username,
            password: hashedPassword,
            fullName,
            qualification,
            dob,
            role: 'user' // Default role
        });
        // Remove password from response
        const userResponse = user.toJSON();
        delete userResponse.password;
        return res.status(201).json({
            message: 'User registered successfully',
            user: userResponse
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.register = register;
// Login user
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        // Check if user exists
        const user = yield models_1.User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check password
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.get('password'));
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user.get('id'), role: user.get('role') }, process.env.JWT_SECRET || 'quizmaster_secret_key', { expiresIn: '7d' });
        // Remove password from response
        const userResponse = user.toJSON();
        delete userResponse.password;
        return res.status(200).json({
            user: userResponse,
            token
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.login = login;
