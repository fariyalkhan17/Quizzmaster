"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    const Score = sequelize.define('Score', {
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
        user_id: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        time_stamp_of_attempt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW
        },
        total_questions: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false
        },
        total_scored: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false
        },
        time_taken: {
            type: sequelize_1.DataTypes.STRING, // Format: HH:MM:SS
            allowNull: true
        }
    }, {
        timestamps: true,
        tableName: 'scores'
    });
    return Score;
};
