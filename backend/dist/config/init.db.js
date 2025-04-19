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
exports.initializeAdmin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const models_1 = require("../models");
const initializeAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if admin exists
        const adminExists = yield models_1.User.findOne({ where: { role: 'admin' } });
        if (adminExists) {
            console.log('Admin user already exists');
            return;
        }
        // Create admin user
        const hashedPassword = yield bcrypt_1.default.hash('admin123', 10);
        yield models_1.User.create({
            username: 'admin@quizmaster.com',
            password: hashedPassword,
            fullName: 'Admin User',
            role: 'admin'
        });
        console.log('Admin user created successfully');
    }
    catch (error) {
        console.error('Error initializing admin user:', error);
    }
});
exports.initializeAdmin = initializeAdmin;
