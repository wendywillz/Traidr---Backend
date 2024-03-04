import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/database.config';

class Shop extends Model {
  public shopId!: string;
  public nameOfShop!: string;
  public shopCurrency!: string;
  public shopCategory!: string;
  public shopImage!: string | null;
  public shopDescription!: string;
  public shopOwner!: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static associate(models: any): void {
    Shop.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Shop.hasMany(models.Product, { foreignKey: 'shopId', as: 'products' });
  }
}

Shop.init(
  {
    shopId: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
    shopName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shopCurrency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shopCategory: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // howToGetPaid: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    shopImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shopDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shopOwner: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'User',
        key: 'userId', 
      },
    },
  },
  {
    sequelize,
    modelName: 'Shop',
  }
);

export default Shop;