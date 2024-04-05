import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/database.config';
import { v4 as uuidv4 } from 'uuid';
class Sale extends Model {
  public id!: string;
  public userId!: string;
  public orderId!: string;
  public saleTotal!: number;
  public saleStatus!: 'pending'|'completed'|'cancelled';
  
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static associate(models: any): void {
   Sale.hasMany(models.OrderItem, {foreignKey: 'orderItemId', as: 'orderItem'})
   // Sale.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
}

Sale.init(
  {
   saleId: {
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
    orderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'orderId', 
        },
    },
    saleTotal:{
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    saleStatus:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    
  },
  {
    sequelize,
    modelName: 'Sale',
  }
);

export default Sale;



