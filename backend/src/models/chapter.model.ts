import { DataTypes, Sequelize } from 'sequelize';
import { ChapterInstance } from './interfaces';

export default (sequelize: Sequelize) => {
  const Chapter = sequelize.define<ChapterInstance>(
    'Chapter', 
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      subject_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'subjects',
          key: 'id'
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    }, 
    {
      timestamps: true,
      tableName: 'chapters'
    }
  );

  return Chapter;
}; 