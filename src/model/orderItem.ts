import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/database.config';

class OrderItem extends Model {
  public id!: number;
  public orderId!: string;
  public userId!: string;
  public productId!: string;
  public productQuantity!: number
  public shopId!: string;
 
  
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static associate(models: any): void {
    OrderItem.hasMany(models.Product, {foreignKey: `productId`, as: 'product'})
     OrderItem.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
  }
}

OrderItem.init(
  {
   orderItemId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    orderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'orderId', 
        },
      },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'userId', 
      },
    },
    productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'productId', 
        },
      },
    productQuantity:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    shopId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Shops',
        key: 'shopId', 
      },
    },
    //Add Time stamps for order
  },
  {
    sequelize,
    modelName: 'OrderItem',
  }
);

export default OrderItem;