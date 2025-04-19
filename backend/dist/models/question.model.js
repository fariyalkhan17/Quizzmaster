"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    const Question = sequelize.define('Question', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        quiz_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'quizzes',
                key: 'id'
            }
        },
        question_statement: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false
        },
        option1: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        option2: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        option3: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        option4: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false
        },
        correct_option: {
            type: sequelize_1.DataTypes.INTEGER, // 1, 2, 3, or 4
            allowNull: false
        }
    }, {
        timestamps: true,
        tableName: 'questions'
    });
    return Question;
};
