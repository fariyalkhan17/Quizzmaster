"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = exports.Score = exports.Question = exports.Quiz = exports.Chapter = exports.Subject = exports.User = void 0;
const database_1 = __importDefault(require("../config/database"));
exports.sequelize = database_1.default;
// Import model factories
const user_model_1 = __importDefault(require("./user.model"));
const subject_model_1 = __importDefault(require("./subject.model"));
const chapter_model_1 = __importDefault(require("./chapter.model"));
const quiz_model_1 = __importDefault(require("./quiz.model"));
const question_model_1 = __importDefault(require("./question.model"));
const score_model_1 = __importDefault(require("./score.model"));
// Initialize models
exports.User = (0, user_model_1.default)(database_1.default);
exports.Subject = (0, subject_model_1.default)(database_1.default);
exports.Chapter = (0, chapter_model_1.default)(database_1.default);
exports.Quiz = (0, quiz_model_1.default)(database_1.default);
exports.Question = (0, question_model_1.default)(database_1.default);
exports.Score = (0, score_model_1.default)(database_1.default);
// Define relationships
exports.Subject.hasMany(exports.Chapter, { foreignKey: 'subject_id', as: 'chapters' });
exports.Chapter.belongsTo(exports.Subject, { foreignKey: 'subject_id', as: 'subject' });
exports.Chapter.hasMany(exports.Quiz, { foreignKey: 'chapter_id', as: 'quizzes' });
exports.Quiz.belongsTo(exports.Chapter, { foreignKey: 'chapter_id', as: 'chapter' });
exports.Quiz.hasMany(exports.Question, { foreignKey: 'quiz_id', as: 'questions' });
exports.Question.belongsTo(exports.Quiz, { foreignKey: 'quiz_id', as: 'quiz' });
exports.User.hasMany(exports.Score, { foreignKey: 'user_id', as: 'scores' });
exports.Score.belongsTo(exports.User, { foreignKey: 'user_id', as: 'user' });
exports.Quiz.hasMany(exports.Score, { foreignKey: 'quiz_id', as: 'scores' });
exports.Score.belongsTo(exports.Quiz, { foreignKey: 'quiz_id', as: 'quiz' });
exports.default = {
    sequelize: database_1.default,
    User: exports.User,
    Subject: exports.Subject,
    Chapter: exports.Chapter,
    Quiz: exports.Quiz,
    Question: exports.Question,
    Score: exports.Score
};
