import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/database.config';
//import sequelize from '../personal-database/database.config';
import { v4 as uuidv4 } from 'uuid';
class Product extends Model {
  public id!: string;
  public productTitle!: string;
  public productDescription!: string | null;
  public productCategory!: string | null;
  public productImage!: string;
  public productVideo!: string | null;
  public productPrice!: number;
  public shopId!: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static associate(models: any): void {
    Product.belongsTo(models.Shop, { foreignKey: 'shopId', as: 'shop' });
  }
}

Product.init(
  {
   productId: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false
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
    productImages: {
      type: DataTypes.ARRAY(DataTypes.STRING),
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
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Shops',
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


