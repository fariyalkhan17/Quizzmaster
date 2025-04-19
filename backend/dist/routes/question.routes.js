"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const questionController = __importStar(require("../controllers/question.controller"));
const optionController = __importStar(require("../controllers/option.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Question routes
router.post('/', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, questionController.createQuestion);
router.get('/quiz/:quizId', auth_middleware_1.verifyToken, questionController.getQuestionsByQuiz);
router.get('/:id', auth_middleware_1.verifyToken, questionController.getQuestionById);
router.put('/:id', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, questionController.updateQuestion);
router.delete('/:id', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, questionController.deleteQuestion);
// Option routes
router.post('/options', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, optionController.createOption);
router.get('/:questionId/options', auth_middleware_1.verifyToken, optionController.getOptionsByQuestion);
router.get('/options/:id', auth_middleware_1.verifyToken, optionController.getOptionById);
router.put('/options/:id', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, optionController.updateOption);
router.delete('/options/:id', auth_middleware_1.verifyToken, auth_middleware_1.isAdmin, optionController.deleteOption);
exports.default = router;
