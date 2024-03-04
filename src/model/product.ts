import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/database.config';

class Product extends Model {
  public id!: string;
  public productTitle!: string;
  public productDescription!: string | null;
  public productCategory!: string | null;
  public productImage!: Buffer;
  public productVideo!: Buffer | null;
  public productPrice!: number;
  public shopId!: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static associate(models: any): void {
    Product.belongsTo(models.Shop, { foreignKey: 'shopId', as: 'shop' });
  }
}

Product.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
    productTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productDescription: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    productCategory: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    productImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productVideo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    productPrice: {
      type: DataTypes.FLOAT, // Change to FLOAT
      allowNull: false,
    },
    shopId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Shop',
        key: 'shopId', 
      },
    },
  },
  {
    sequelize,
    modelName: 'Product',
  }
);

export default Product;


