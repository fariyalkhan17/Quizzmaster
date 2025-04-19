import { DataTypes, Sequelize } from 'sequelize';
import { SubjectInstance } from './interfaces';

export default (sequelize: Sequelize) => {
  const Subject = sequelize.define<SubjectInstance>(
    'Subject', 
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, 
    {
      timestamps: true,
      tableName: 'subjects'
    }
  );

  return Subject;
}; 