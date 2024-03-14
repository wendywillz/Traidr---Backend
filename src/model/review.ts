import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/database.config';
import { v4 as uuidv4 } from 'uuid';

class Review extends Model {
 public reviewId!: string;
 public productId!: string;
 public reviewRating?: number;
 public reviewText!: string;
  public reviewerId!: string;
  public reviewerName!: string;
  public shopName?: string;
  
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
     type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
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
      allowNull: true,
    },
    reviewText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    reviewerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    reviewerName: {
      type: DataTypes.STRING,
      allowNull: false,
     }, 
    shopName: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
 },
 {
    sequelize,
    modelName: 'Reviews',
    timestamps: true, 
 }
);

export default Review;

