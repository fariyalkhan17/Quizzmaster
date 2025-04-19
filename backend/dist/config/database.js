"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Database configuration for PostgreSQL
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME || 'quizmaster', process.env.DB_USER || 'postgres', process.env.DB_PASSWORD || 'postgres', {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
exports.default = sequelize;
