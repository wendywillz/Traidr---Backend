import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/database.config';
import { v4 as uuidv4 } from 'uuid';

class Review extends Model {
 public reviewId!: number;
 public productId!: string;
 public reviewRating!: number;
 public reviewContent!: string;
 public name!: string;
 public shopName!: string;
 public date!: Date;

 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 static associate(models: any): void {
    Review.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Review.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
 }
}

Review.init(
 {
    reviewId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    productId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      allowNull: false,
      references: {
        model: 'Products', 
        key: 'productId',
      },
    },
    reviewRating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reviewContent: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shopName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
 },
 {
    sequelize,
    modelName: 'Review',
    timestamps: true, 
 }
);

export default Review;

