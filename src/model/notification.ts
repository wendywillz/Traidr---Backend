import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/database.config';
import { v4 as uuidv4 } from 'uuid';

class Notification extends Model {
  public id!: string;
  public notificationTitle!: string;
  public notificationMessage!: string;
  public userId!: string;


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static associate(models: any): void {
    Notification.belongsTo(models.User, { foreignKey: 'UserId', as: 'user' });
  }
}

Notification.init(
  {
   Id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
      allowNull: false
    },
    notificationTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notificationMessage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
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
    modelName: 'Notification',
  }
);

export default Notification;


