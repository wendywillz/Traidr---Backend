import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/database.config';
import { v4 as uuidv4 } from 'uuid';
class Order extends Model {
  public id!: string;
  public userId!: string;
  public cartId!: string;
  
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static associate(models: any): void {
   // Order.hasMany(models.OrderItem, {foreignKey: 'orderItemId', as: 'orderItem'})
    Order.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
}

Order.init(
  {
   orderId: {
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
    },
    cartId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Carts',
          key: 'cartId', 
        },
      },
  },
  {
    sequelize,
    modelName: 'Order',
  }
);

export default Order;


/**
 * ORDER ITEM TABLE:
 * orderItemId: (could be autoIncremanet)
 * orderId: foreignkey
 * productId: foreignkey,
 * productQuanity
 * 
 * 
 * Cart: cartId, usrId
 * CartItem: cartItemtId, userId, cartId, ProductId, Quanity
 * Order: OrderId, userId(foreignkey), shopId(Foreignkey), createdAt/TimeStamps,
 * OrderITem: OrderItemId, OrderId(foreignkey), ProductId(FK), Quantity,
 * 
 */