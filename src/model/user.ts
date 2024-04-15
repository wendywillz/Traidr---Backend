import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/database.config';
import { v4 as uuidv4 } from 'uuid';

class User extends Model {
  public userId!: string;
  public name!: string;
  public otp!: string;
  public otpSecret!: string;
  public otpExpirationTime!: Date;
  public email!: string;
  public isVerified!: boolean;
  public password!: string;
  public phoneNumber!: number; 
  public resetPasswordExpiration!: Date | null;
  public resetPasswordToken!: string | null;
  public isAdmin!: boolean;
  public isSeller!: boolean;
  public gender!: string|null;
  public age!: number|null;
  public dateOfBirth!: number|null;
  public address!: string|null;
  public shopName!: string|null;
  public profilePic!: string|null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static associate(models: any): void {
    User.hasMany(models.Shop, { foreignKey: 'userId', as: 'shops' });
  }
}

User.init(
  {
    userId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hearAboutUs: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otpSecret: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otpExpirationTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpiration: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isSeller: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    gender:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    age:{
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    address:{
      type: DataTypes.STRING,
      allowNull:true,
    },
    shopName:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    profilePic: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Users',
  }
);


export default User;