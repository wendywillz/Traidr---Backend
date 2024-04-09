import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/database.config';
//import sequelize from '../personal-database/database.config';
import { v4 as uuidv4 } from 'uuid';
class Shop extends Model {
  public shopId!: string;
  public shopName!: string;
  public shopCurrency!: string | null;
  public shopCategory!: string | null;
  // public howToGetPaid!: string | null;
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
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false
    },
    shopName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shopCurrency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shopCategory: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // howToGetPaid: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    shopImageURL: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shopDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shopCountry: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shopStreetAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shopCity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shopState: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shopZipCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    shopOwner: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'userId', 
      },
    },
  },
  {
    sequelize,
    modelName: 'Shops',
  }
);

export default Shop;