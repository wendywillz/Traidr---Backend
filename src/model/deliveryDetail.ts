import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/database.config';
import { v4 as uuidv4 } from 'uuid';
class DeliveryDetail extends Model {
  public id!: string;
  public userId!: string;
  public orderId!: string;
  public saleId!: string;
  public recipientName!: string;
  public recipientPhoneNumber!: number;
  public deliveryAddress!: string;
  public deliveryInstructions!: string;
  public deliveryStatus!: "pending"|"inTransit"|"delivered"|"cancelled";
  
  
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static associate(models: any): void {
   DeliveryDetail.hasMany(models.Sale, {foreignKey: 'saleId', as: 'sale'})
   // DeliveryDetails.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
}

DeliveryDetail.init(
  {
   deliveryId: {
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
    orderId:{
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'orderId', 
        },
    },
    saleId:{
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Sales',
        key: 'saleId', 
      },
  },
    recipientName:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    recipientPhoneNumber:{
        type: DataTypes.BIGINT,
        allowNull: true,
    },
    deliveryAddress:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    deliveryInstructions:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    deliveryStatus:{
    type: DataTypes.STRING,
    allowNull: true,
    },
    
  },
  {
    sequelize,
    modelName: 'DeliveryDetail',
  }
);

export default DeliveryDetail;



