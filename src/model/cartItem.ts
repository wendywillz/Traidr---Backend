import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/database.config';
import { v4 as uuidv4 } from 'uuid';
class CartItem extends Model {
  public id!: string;
  public cartId!: string;
  public userId!: string;
  public productId!: string;
  public productQuantity!: number;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static associate(models: any): void {
    CartItem.hasMany(models.Product, {foreignKey: `productId`, as: 'product'})
    CartItem.belongsTo(models.Cart, { foreignKey: 'cartId', as: 'cart' });
  }
}

CartItem.init(
  {
   cartItemId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    cartId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Cart',
        key: 'cartId', 
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'User',
        key: 'userId', 
      },
    },
    productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Product',
          key: 'productId', 
        },
      },
    productQuantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  },
  {
    sequelize,
    modelName: 'CartItem',
  }
);

export default CartItem;


