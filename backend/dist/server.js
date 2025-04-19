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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const models_1 = require("./models");
const init_db_1 = require("./config/init.db");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || '5000', 10);
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const subject_routes_1 = __importDefault(require("./routes/subject.routes"));
const chapter_routes_1 = __importDefault(require("./routes/chapter.routes"));
const quiz_routes_1 = __importDefault(require("./routes/quiz.routes"));
const question_routes_1 = __importDefault(require("./routes/question.routes"));
const score_routes_1 = __importDefault(require("./routes/score.routes"));
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/subjects', subject_routes_1.default);
app.use('/api/chapters', chapter_routes_1.default);
app.use('/api/quizzes', quiz_routes_1.default);
app.use('/api/questions', question_routes_1.default);
app.use('/api/scores', score_routes_1.default);
// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Quiz Master API' });
});
// Start server
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server is running on port ${PORT}`);
    try {
        yield models_1.sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        // Sync database (in development)
        yield models_1.sequelize.sync({ alter: true });
        console.log('Database synchronized');
        // Initialize admin user
        yield (0, init_db_1.initializeAdmin)();
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}));
