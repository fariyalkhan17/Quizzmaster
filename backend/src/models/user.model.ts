import { DataTypes, Sequelize } from 'sequelize';
import { UserInstance } from './interfaces';

export default (sequelize: Sequelize) => {
  const User = sequelize.define<UserInstance>(
    'User', 
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      qualification: {
        type: DataTypes.STRING,
        allowNull: true
      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      role: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user'
      }
    }, 
    {
      timestamps: true,
      tableName: 'users'
    }
  );

  return User;
}; 