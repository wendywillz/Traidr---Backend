import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/database.config';
import { v4 as uuidv4 } from 'uuid';
class Cart extends Model {
  public cartId!: string;
  public userId!: string;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static associate(models: any): void {
    Cart.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
}

Cart.init(
  {
   cartId: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'userId', 
      },
    }
  },
  {
    sequelize,
    modelName: 'Cart',
  }
);

export default Cart;


